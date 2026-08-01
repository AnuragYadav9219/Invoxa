package com.invoice.tracker.entity.subscription;

public enum PlanType {
    FREE(1),
    PRO(2),
    BUSINESS(3);

    private final int level; 
    
    PlanType(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }
}
