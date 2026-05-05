package com.ejemplo.model;

import java.util.List;

public class AnimeSeries {

    private final String slug;
    private final String title;
    private final String realm;
    private final String description;
    private final String accentFrom;
    private final String accentTo;
    private final List<AnimeTopic> topics;

    public AnimeSeries(
        String slug,
        String title,
        String realm,
        String description,
        String accentFrom,
        String accentTo,
        List<AnimeTopic> topics
    ) {
        this.slug = slug;
        this.title = title;
        this.realm = realm;
        this.description = description;
        this.accentFrom = accentFrom;
        this.accentTo = accentTo;
        this.topics = List.copyOf(topics);
    }

    public String getSlug() {
        return slug;
    }

    public String getTitle() {
        return title;
    }

    public String getRealm() {
        return realm;
    }

    public String getDescription() {
        return description;
    }

    public String getAccentFrom() {
        return accentFrom;
    }

    public String getAccentTo() {
        return accentTo;
    }

    public List<AnimeTopic> getTopics() {
        return topics;
    }

    public AnimeTopic findTopic(String topicSlug) {
        for (AnimeTopic topic : topics) {
            if (topic.getSlug().equals(topicSlug)) {
                return topic;
            }
        }
        return null;
    }
}
