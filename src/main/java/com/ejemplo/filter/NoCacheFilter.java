package com.ejemplo.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter("/*")
public class NoCacheFilter implements Filter {

    private static final String DISABLE_CACHE_FLAG = "true";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (response instanceof HttpServletResponse httpResponse && shouldDisableCache()) {
            httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
            httpResponse.addHeader("Cache-Control", "post-check=0, pre-check=0");
            httpResponse.setHeader("Pragma", "no-cache");
            httpResponse.setDateHeader("Expires", 0);
        }

        chain.doFilter(request, response);
    }

    private boolean shouldDisableCache() {
        String envValue = System.getenv("APP_DISABLE_CACHE");
        return DISABLE_CACHE_FLAG.equalsIgnoreCase(envValue);
    }
}
