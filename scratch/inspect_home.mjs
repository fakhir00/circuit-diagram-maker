import fs from 'fs';

const home = JSON.parse(fs.readFileSync('src/data/i18n/home.json', 'utf8'));

for (const loc of ['es', 'id', 'tr', 'bg']) {
  console.log(`\n=================== LOCALE: ${loc} ===================`);
  console.log('Title:', home[loc]?.['home.hero.title']);
  console.log('Meta Desc:', home[loc]?.['home.hero.meta_desc']);
  console.log('Subtitle:', home[loc]?.['home.hero.subtitle']?.slice(0, 100));
  console.log('Features 1:', home[loc]?.['home.features.cards']?.[0]);
  console.log('Features 2:', home[loc]?.['home.features.cards']?.[1]);
  console.log('How it works 1:', home[loc]?.['home.how_it_works.steps']?.[0]);
}
