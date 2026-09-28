import React from "react";
import { Kicker, SplitTitle } from "./ui/Primitives";

/**
 * Единая «шапка» внутренних страниц — она держит весь портал в одном ритме
 * и мягко перетекает в содержимое раздела.
 */
export default function PageIntro({ kicker, title, lead, aside, children }) {
  return (
    <section className="page-intro">
      <div className="shell page-intro-inner">
        <div className="page-intro-copy">
          <Kicker>{kicker}</Kicker>
          <h1 className="display">
            <SplitTitle lines={title} delay={60} />
          </h1>
          {lead && <p className="lead page-intro-lead">{lead}</p>}
          {children}
        </div>
        {aside && <div className="page-intro-aside">{aside}</div>}
      </div>
    </section>
  );
}
