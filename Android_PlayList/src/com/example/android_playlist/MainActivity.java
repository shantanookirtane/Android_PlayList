package com.example.android_playlist;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // setContentView(R.layout.activity_main);
        WebView webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        // TO enable JS
        settings.setJavaScriptEnabled(true);
        // To enable Localstorage
        settings.setDomStorageEnabled(true);
        
        
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
