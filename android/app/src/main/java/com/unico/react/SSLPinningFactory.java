package com.unico.react;

import android.util.Log;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;

public class SSLPinningFactory implements OkHttpClientFactory {
    private static String hostname = "page-drive-2970--leadmgmt.sandbox.my.site.com";
    private static String SHAKEY = "sha256/jmmp7MWVw89mx3w6bAdicgfU+93j3h1y636/3xm5iGQ=";
    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        try{
            CertificatePinner certificatePinner = new CertificatePinner.Builder()
                    .add(hostname, SHAKEY)
                    .build();
            OkHttpClient.Builder clientBuilder = OkHttpClientProvider.createClientBuilder();
            return clientBuilder.certificatePinner(certificatePinner).build();
        }catch (Exception e){
            Log.d("error", e.getMessage());

        }
        return  null;

    }
}
