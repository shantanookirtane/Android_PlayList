package com.example.android_playlist;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.webkit.JavascriptInterface;

/**
 * This class is used as a substitution of the local storage in Android webviews
 * 
 * @author Diane
 */
public class LocalStorageJavaScriptInterface {
        private Context mContext;
        private LocalStorage localStorageDBHelper;
        private SQLiteDatabase database;

        LocalStorageJavaScriptInterface(Context c) {
                mContext = c;
                localStorageDBHelper = LocalStorage.getInstance(mContext);
        }

        /**
         * This method allows to get an item for the given key
         * @param key : the key to look for in the local storage
         * @return the item having the given key
         */
        @JavascriptInterface
        public String getItem(String key)
        {
                String value = null;
                if(key != null)
                {
                        database = localStorageDBHelper.getReadableDatabase();
                        Cursor cursor = database.query(LocalStorage.LOCALSTORAGE_TABLE_NAME,
                                        null, 
                                        LocalStorage.LOCALSTORAGE_ID + " = ?", 
                                        new String [] {key},null, null, null);
                        if(cursor.moveToFirst())
                        {
                                value = cursor.getString(1);
                        }
                        cursor.close();
                        database.close();
                }
                return value;
        }

        /**
         * set the value for the given key, or create the set of datas if the key does not exist already.
         * @param key
         * @param value
         */
        @JavascriptInterface
        public void setItem(String key,String value)
        {
                if(key != null && value != null)
                {
                        String oldValue = getItem(key);
                        database = localStorageDBHelper.getWritableDatabase();
                        ContentValues values = new ContentValues();
                        values.put(LocalStorage.LOCALSTORAGE_ID, key);
                        values.put(LocalStorage.LOCALSTORAGE_VALUE, value);
                        if(oldValue != null)
                        {
                                database.update(LocalStorage.LOCALSTORAGE_TABLE_NAME, values, LocalStorage.LOCALSTORAGE_ID + " = " + key, null);
                        }
                        else
                        {
                                database.insert(LocalStorage.LOCALSTORAGE_TABLE_NAME, null, values);
                        }
                        database.close();
                }
        }

        /**
         * removes the item corresponding to the given key
         * @param key
         */
        @JavascriptInterface
        public void removeItem(String key)
        {
                if(key != null)
                {
                        database = localStorageDBHelper.getWritableDatabase();
                        database.delete(LocalStorage.LOCALSTORAGE_TABLE_NAME, LocalStorage.LOCALSTORAGE_ID + " = " + key, null);
                        database.close();
                }
        }

        /**
         * clears all the local storage.
         */
        @JavascriptInterface
        public void clear()
        {
                database = localStorageDBHelper.getWritableDatabase();
                database.delete(LocalStorage.LOCALSTORAGE_TABLE_NAME, null, null);
                database.close();
        }
}
