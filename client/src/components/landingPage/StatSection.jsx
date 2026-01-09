import React from "react";

export const StatSection = () => {
  return (
    <div>
      {/* Stats Section */}
      <section className="py-8 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                50K+
              </div>
              <p className="text-muted-foreground">Happy Travelers</p>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                200+
              </div>
              <p className="text-muted-foreground">Destinations</p>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                4.9/5
              </div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                98%
              </div>
              <p className="text-muted-foreground">Would Recommend</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
