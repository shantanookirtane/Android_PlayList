package com.example.android_playlist;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {
	
	
    
/*    <WebView android:id="@+id/webview"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
	/> 
*/
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
     //  WebView webView = new WebView(this);
        
       WebView webView = (WebView) findViewById(R.id.webView);
        
        //webView.setWebChromeClient(n);
        
        WebSettings settings = webView.getSettings();
        // TO enable JS
        settings.setJavaScriptEnabled(true);
        // To enable Localstorage
        settings.setDomStorageEnabled(true);
        
        //those two lines seem necessary to keep data that were stored even if the app was killed.
        settings.setDatabaseEnabled(true);
        
        
        
        //add the JavaScriptInterface so that JavaScript is able to use LocalStorageJavaScriptInterface's methods when calling "LocalStorage"
        webView.addJavascriptInterface(new LocalStorageJavaScriptInterface(getApplicationContext()), "LocalStorage");
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
    
    
}
