package com.example.android_playlist;

import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class MainActivity extends Activity {
	
	
	private VideoEnabledWebView webView;
	private VideoEnabledWebChromeClient webChromeClient;
    private static final String TAG = MainActivity.class.getSimpleName();
/*    <WebView android:id="@+id/webview"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
	/> 
*/
    
	@Override
    protected void onCreate(Bundle savedInstanceState) {
    	
    	super.onCreate(savedInstanceState);

        // Set layout
        setContentView(R.layout.activity_main);

        // Save the web view
        webView = (VideoEnabledWebView) findViewById(R.id.webView);

        // Initialize the VideoEnabledWebChromeClient and set event handlers
        View nonVideoLayout = findViewById(R.id.nonVideoLayout); // Your own view, read class comments
        ViewGroup videoLayout = (ViewGroup) findViewById(R.id.videoLayout); // Your own view, read class comments
     //   View loadingView = getLayoutInflater().inflate(R.layout.view_loading_video, null); // Your own view, read class comments
        webChromeClient = new VideoEnabledWebChromeClient(nonVideoLayout, videoLayout, webView) { // See all available constructors...
            // Subscribe to standard events, such as onProgressChanged()...
            @Override
            public void onProgressChanged(WebView view, int progress) {
                // Your code...
            }
        };
        
        webChromeClient.setOnToggledFullscreen(new VideoEnabledWebChromeClient.ToggledFullscreenCallback() {
            @Override
            public void toggledFullscreen(boolean fullscreen) {
                // Your code to handle the full-screen change, for example showing and hiding the title bar. Example:
                if (fullscreen) {
                    WindowManager.LayoutParams attrs = getWindow().getAttributes();
                    attrs.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
                    attrs.flags |= WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON;
                    getWindow().setAttributes(attrs);
                    if (android.os.Build.VERSION.SDK_INT >= 14)
                    {
                        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE);
                    }
                }
                else
                {
                    WindowManager.LayoutParams attrs = getWindow().getAttributes();
                    attrs.flags &= ~WindowManager.LayoutParams.FLAG_FULLSCREEN;
                    attrs.flags &= ~WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON;
                    getWindow().setAttributes(attrs);
                    if (android.os.Build.VERSION.SDK_INT >= 14)
                    {
                        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
                    }
                }
            }
        });
        
        
      //add the JavaScriptInterface so that JavaScript is able to use LocalStorageJavaScriptInterface's methods when calling "LocalStorage"
        webView.addJavascriptInterface(new LocalStorageJavaScriptInterface(this), "LocalStorage");
        
        WebSettings settings = webView.getSettings();
         
        // TO enable JS
        settings.setJavaScriptEnabled(true);
        // To enable Localstorage
        settings.setDomStorageEnabled(true);
        //those two lines seem necessary to keep data that were stored even if the app was killed.
        settings.setDatabaseEnabled(true);
        settings.setDatabasePath(this.getFilesDir().getParentFile().getPath()+"/databases/");
        
        webView.setWebChromeClient(webChromeClient);
        
        if (Build.VERSION.SDK_INT < 8) {
        	//webView.getSettings().setPluginState(state);
        } else {
        	webView.getSettings().setPluginState(PluginState.ON);
        }

        // Navigate everywhere you want, this classes have only been tested on YouTube's mobile site
        webView.loadUrl("file:///android_asset/main.html");
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
      //  getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
    @Override
    public void onBackPressed()
    {
        // Notify the VideoEnabledWebChromeClient, and handle it ourselves if it doesn't handle it
        if (!webChromeClient.onBackPressed())
        {
            if (webView.canGoBack())
            {
                webView.goBack();
            }
            else
            {
                // Close app (presumably)
                super.onBackPressed();
            }
        }
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
            
            /*            
             * gets the JSON data.
             * @throws IOException 
             */
            /**
             * @return
             */
            @JavascriptInterface
            public String getJsonData() {
            	Log.d(TAG, "Loading json data start");
            	AssetManager am = mContext.getAssets();
            	InputStream jsonDataIStream = null;
            	//String jsonDataString = null;
            	JsonElement jsonElement = null;
            	JsonObject configObject = null;
            	try {
            	jsonDataIStream = am.open("videos_test.jsonp");
            	jsonElement = new JsonParser().parse(IOUtils.toString(jsonDataIStream));
            	configObject = jsonElement.getAsJsonObject();
            	} catch (IOException ioe) {
            		// ioe.printStackTrace();
            		Log.e(TAG, "Error Reading the json data from server, loading default version");
            	} finally {
            		if (null != jsonDataIStream) {
            			try {
							jsonDataIStream.close();
						} catch (IOException e) {
							// TODO Auto-generated catch block
							Log.e(TAG, "Error closing jsonDataStream");
						}
            		}
            	}
            	return ((configObject == null)?"":configObject.toString());
            }
            
            
            
    }

    
    
}
