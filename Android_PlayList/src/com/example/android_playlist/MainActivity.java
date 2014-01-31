package com.example.android_playlist;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {
	
	
    private WebView webView;
    private static final String TAG = MainActivity.class.getSimpleName();
/*    <WebView android:id="@+id/webview"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
	/> 
*/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
       webView = new WebView(this);
        
       // webView = (WebView) findViewById(R.id.webView);
        
        //webView.setWebChromeClient(n);
        
        WebSettings settings = webView.getSettings();
        // TO enable JS
        settings.setJavaScriptEnabled(true);
        // To enable Localstorage
        settings.setDomStorageEnabled(true);
        
        //those two lines seem necessary to keep data that were stored even if the app was killed.
        settings.setDatabaseEnabled(true);
        
        
        
        //add the JavaScriptInterface so that JavaScript is able to use LocalStorageJavaScriptInterface's methods when calling "LocalStorage"
        webView.addJavascriptInterface(new LocalStorageJavaScriptInterface(this), "LocalStorage");
        
        // for debugging, this will handle the console.log() in javascript
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage cm) {
                Log.d(TAG, cm.message() + " #" + cm.lineNumber() + " --" + cm.sourceId() );
                return true;
            }
        });
        
        Log.d("Activity", "Main activity ended");

     /*   
        webView.setWebChromeClient(new WebChromeClient() { 
            public void onExceededDatabaseQuota(String url, String databaseIdentifier, long currentQuota, long estimatedSize, long totalUsedQuota, WebStorage.QuotaUpdater quotaUpdater) { 
                    quotaUpdater.updateQuota(5 * 1024 * 1024); 
                } 
            });*/
        
        //load HTML File in webview
        webView.loadUrl("file:///android_asset/main.html");
        
       setContentView(webView);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
      //  getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    
    /**
     * This class is used as a substitution of the local storage in Android webviews
     * 
     * @author Diane
     */
    private class LocalStorageJavaScriptInterface {
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

    
    
}
