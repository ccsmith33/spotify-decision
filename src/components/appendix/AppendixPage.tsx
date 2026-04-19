import styles from './AppendixPage.module.css';

const paragraphs = [
  "Our final website was really shaped by how this project developed over the semester. At the beginning, the case was pretty open-ended, so a big part of our work was figuring out what the actual problem was before we could build a solution. Early on, we had to think through fairness, transparency, trust, and accountability, not just from the company's side but from the user's side too. That helped us realize this could not just be a website full of technical AI language. It needed to explain automated decisions in a way normal people could actually understand.",
  "A lot of the middle assignments helped us narrow down what actually needed to be in the site. The backlog especially helped us prioritize the most important features, like plain-language explanations, showing what affects recommendations, having a fairness and oversight section, and giving users a way to appeal decisions they feel are unfair. That made the final product feel a lot more focused, because we were not just adding random pages — we were building around the features that seemed most important to the problem.",
  "The data modeling work also helped shape the final website more than it might seem at first. It forced us to think through what the system would need behind the scenes in order for the site to make sense. Breaking things up into areas like algorithmic decisions, explanations, fairness audits, and appeals helped give structure to the final product. That is a big reason why the website ended up with clear sections for recommendation transparency, fairness metrics, decision history, and challenging a decision instead of just one vague \"AI info\" page.",
  "Overall, the semester's assignments helped us move from a broad idea to a much more complete and realistic website. Instead of just making something that looked good, we were constantly using earlier work to justify what belonged in the portal and how it should function. Things like planning, process thinking, and change management made us think beyond the prototype itself and more about how something like this would actually be rolled out and used in a real organization. So the final website really reflects the whole semester process of understanding the problem, narrowing the priorities, and turning that into a more practical solution.",
];

export function AppendixPage() {
  return (
    <div className={styles.page}>
      <article className={styles.essay}>
        <h1 className={styles.title}>Project Reflection</h1>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </article>
    </div>
  );
}
