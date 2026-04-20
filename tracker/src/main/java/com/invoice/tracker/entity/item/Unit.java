package com.invoice.tracker.entity.item;

public enum Unit {

    G("g"),
    KG("kg"),
    TON("ton"),

    BAG("bag"),
    PIECE("piece"),

    CUBIC_FEET("ft³"),
    CUBIC_METER("m³"),

    SQUARE_FEET("ft²"),
    SQUARE_METER("m²");

    private final String displayName;

    Unit(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}