package com.ejemplo.model;

import java.util.List;

public class AnimeTopic {

    private final String slug;
    private final String title;
    private final String teaser;
    private final String overview;
    private final List<String> highlights;

    public AnimeTopic(String slug, String title, String teaser, String overview, List<String> highlights) {
        this.slug = slug;
        this.title = title;
        this.teaser = teaser;
        this.overview = overview;
        this.highlights = List.copyOf(highlights);
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getTeaser() {
        return teaser;
    }

    public String getOverview() {
        return overview;
    }

    public List<String> getHighlights() {
        return highlights;
    }
}
