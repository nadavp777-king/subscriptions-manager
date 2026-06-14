import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

const SubscriptionContext = createContext({});

export const SubscriptionProvider = ({ children }) => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load subscriptions from Supabase when user changes
  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching subscriptions:', error);
          setSubscriptions([]);
        } else {
          const mappedData = data.map(row => {
            let nextBillingDate = row.next_billing_date;
            if (nextBillingDate) {
              // Parse components to avoid UTC timezone offsets shifting the date by a few hours
              const [y, m, d] = nextBillingDate.split('T')[0].split('-').map(Number);
              let dateObj = new Date(y, m - 1, d);
              
              const today = new Date();
              today.setHours(0, 0, 0, 0); // normalize to local midnight
              let changed = false;

              // advance until the date is strictly in the future (tomorrow or later)
              while (dateObj <= today) {
                changed = true;
                if (row.billing_cycle?.toLowerCase() === 'yearly') {
                  dateObj.setFullYear(dateObj.getFullYear() + 1);
                } else {
                  dateObj.setMonth(dateObj.getMonth() + 1);
                }
              }

              if (changed) {
                // toISOString might shift days due to timezone, so use local format
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                nextBillingDate = `${year}-${month}-${day}`;
                
                // Silently update database
                supabase.from('subscriptions')
                  .update({ next_billing_date: nextBillingDate })
                  .eq('id', row.id)
                  .then(({error}) => { if (error) console.error("Auto-renew failed:", error); });
              }
            }

            return {
              ...row,
              price: row.amount,
              billingCycle: row.billing_cycle,
              nextBillingDate: nextBillingDate
            };
          });
          setSubscriptions(mappedData || []);
        }
      } else {
        setSubscriptions([]);
      }
      setLoading(false);
    };

    fetchSubscriptions();
  }, [user]);

  const addSubscription = async (sub) => {
    if (!user) return;
    
    const dbSub = {
      name: sub.name,
      amount: sub.price,
      billing_cycle: sub.billingCycle ? sub.billingCycle.toLowerCase() : 'monthly',
      category: sub.category,
      next_billing_date: sub.nextBillingDate,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([dbSub])
      .select();

    if (error) {
      console.error('Error adding subscription:', error);
      throw error; // Throw error to be caught by UI
    } else {
      // Fallback to optimistic update if select data is null due to RLS
      const insertedData = data && data.length > 0 ? data[0] : dbSub;
      const mappedData = {
        ...insertedData,
        price: insertedData.amount || sub.price,
        billingCycle: sub.billingCycle, // Keep original casing for UI
        nextBillingDate: insertedData.next_billing_date || sub.nextBillingDate,
        id: insertedData.id || Date.now() // temporary ID if not returned
      };
      setSubscriptions([...subscriptions, mappedData]);
    }
  };

  const addMultipleSubscriptions = async (subsArray) => {
    if (!user || subsArray.length === 0) return;

    const dbSubs = subsArray.map(sub => ({
      name: sub.name,
      amount: sub.price,
      billing_cycle: sub.billingCycle ? sub.billingCycle.toLowerCase() : 'monthly',
      category: sub.category,
      next_billing_date: sub.nextBillingDate,
      user_id: user.id
    }));

    const { data, error } = await supabase
      .from('subscriptions')
      .insert(dbSubs)
      .select();

    if (error) {
      console.error('Error adding multiple subscriptions:', error);
      throw error; // Throw error to be caught by UI
    } else {
      // Fallback to optimistic update if select data is null due to RLS
      const insertedData = data && data.length > 0 ? data : dbSubs;
      const mappedData = insertedData.map((row, idx) => ({
        ...row,
        price: row.amount || subsArray[idx].price,
        billingCycle: subsArray[idx].billingCycle, // Keep original casing for UI
        nextBillingDate: row.next_billing_date || subsArray[idx].nextBillingDate,
        id: row.id || Date.now() + idx // temporary ID if not returned
      }));
      setSubscriptions([...subscriptions, ...mappedData]);
    }
  };

  const removeSubscription = async (id) => {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscription:', error);
    } else {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    }
  };

  const updateSubscription = async (id, updatedFields) => {
    const dbUpdates = {};
    if (updatedFields.name !== undefined) dbUpdates.name = updatedFields.name;
    if (updatedFields.price !== undefined) dbUpdates.amount = updatedFields.price;
    if (updatedFields.billingCycle !== undefined) dbUpdates.billing_cycle = updatedFields.billingCycle;
    if (updatedFields.category !== undefined) dbUpdates.category = updatedFields.category;
    if (updatedFields.nextBillingDate !== undefined) dbUpdates.next_billing_date = updatedFields.nextBillingDate;

    const { data, error } = await supabase
      .from('subscriptions')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating subscription:', error);
    } else if (data) {
      const mappedData = data.map(row => ({
        ...row,
        price: row.amount,
        billingCycle: row.billing_cycle,
        nextBillingDate: row.next_billing_date
      }));
      setSubscriptions(
        subscriptions.map((sub) => (sub.id === id ? { ...sub, ...mappedData[0] } : sub))
      );
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        loading,
        addSubscription,
        addMultipleSubscriptions,
        removeSubscription,
        updateSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => useContext(SubscriptionContext);
