import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Recipe from "./models/Recipe";
import Comment from "./models/Comment";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('recipes');
        await db.dropCollection('comments');
    } catch (error) {
        console.log('Collections were not present, skipping drop');
    }

    const john = new User({
        email: "john@example.com",
        displayName: "John",
        password: "123",
    });

    john.generateToken();
    await john.save();

    const jane = new User({
        email: "jane@example.com",
        displayName: "Jane",
        password: "123",
    });

    jane.generateToken();
    await jane.save();

    const recipe1 = new Recipe({
        title: "Спагетти Карбонара",
        description: `Классическое итальянское блюдо с нежным сливочным соусом, беконом и пармезаном.

Ингредиенты:
- Спагетти - 400 г
- Бекон или панчетта - 200 г
- Яйца - 3 шт
- Сыр Пармезан - 100 г
- Чеснок - 2 зубчика
- Сливки 20% - 100 мл
- Соль, черный перец по вкусу

Приготовление:
1. Отварите спагетти в подсоленной воде согласно инструкции на упаковке.
2. Обжарьте бекон на сковороде до хрустящей корочки.
3. В миске взбейте яйца, добавьте тертый пармезан, сливки, соль и перец.
4. Смешайте горячие спагетти с беконом, затем добавьте яичную смесь.
5. Быстро перемешайте, чтобы яйца схватились, но не свернулись.
6. Подавайте сразу, посыпав дополнительным пармезаном.`,
        image: "fixtures/carbonara.jpg",
        author: john._id,
    });
    await recipe1.save();

    const recipe2 = new Recipe({
        title: "Греческий салат",
        description: `Освежающий и полезный салат с овощами и сыром фета.

Ингредиенты:
- Помидоры - 3 шт
- Огурцы - 2 шт
- Красный лук - 1 шт
- Сладкий перец - 1 шт
- Сыр Фета - 200 г
- Маслины без косточек - 100 г
- Оливковое масло - 3 ст.л.
- Лимонный сок - 1 ст.л.
- Сушеный орегано - 1 ч.л.
- Соль по вкусу

Приготовление:
1. Нарежьте помидоры и огурцы крупными кубиками.
2. Лук нарежьте тонкими полукольцами, перец - соломкой.
3. Сложите все овощи в большую миску, добавьте маслины.
4. Сверху выложите кубики сыра фета.
5. Заправьте оливковым маслом, лимонным соком и посыпьте орегано.
6. Аккуратно перемешайте перед подачей.`,
        image: "fixtures/greek-salad.jpg",
        author: jane._id,
    });
    await recipe2.save();

    const recipe3 = new Recipe({
        title: "Куриный суп с лапшой",
        description: `Ароматный и согревающий суп - идеальное блюдо для холодного дня.

Ингредиенты:
- Куриная грудка - 1 шт
- Лапша яичная - 200 г
- Морковь - 2 шт
- Лук репчатый - 1 шт
- Сельдерей - 2 стебля
- Чеснок - 3 зубчика
- Лавровый лист - 2 шт
- Укроп свежий - пучок
- Соль, перец горошком - по вкусу

Приготовление:
1. Куриную грудку залейте 3 литрами воды, доведите до кипения.
2. Снимите пену, добавьте целую луковицу, лавровый лист и перец.
3. Варите на медленном огне 30 минут.
4. Достаньте курицу, отделите мясо от костей.
5. В бульон добавьте нарезанные морковь и сельдерей, варите 10 минут.
6. Добавьте лапшу и варите еще 8-10 минут.
7. Верните куриное мясо в суп, посолите по вкусу.
8. Подавайте с свежим укропом.`,
        image: "fixtures/chicken-soup.jpg",
        author: john._id,
    });
    await recipe3.save();

    const recipe4 = new Recipe({
        title: "Шоколадный брауни",
        description: `Влажный и шоколадный десерт с хрустящей корочкой.

Ингредиенты:
- Темный шоколад - 200 г
- Сливочное масло - 150 г
- Сахар - 200 г
- Яйца - 3 шт
- Мука - 100 г
- Какао-порошок - 2 ст.л.
- Грецкие орехи - 100 г
- Соль - щепотка

Приготовление:
1. Растопите шоколад с маслом на водяной бане.
2. Взбейте яйца с сахаром до светлой пены.
3. Аккуратно смешайте шоколадную массу с яичной.
4. Просейте муку с какао и солью, добавьте к смеси.
5. Добавьте измельченные орехи.
6. Вылейте тесто в форму, застеленную пергаментом.
7. Выпекайте при 180°C 25-30 минут.
8. Дайте полностью остыть перед нарезкой.`,
        image: "fixtures/brownie.jpg",
        author: jane._id,
    });
    await recipe4.save();

    const comment1 = new Comment({
        text: "Отличный рецепт! Получилось очень вкусно, вся семья в восторге!",
        recipe: recipe1._id,
        author: jane._id,
    });
    await comment1.save();

    const comment2 = new Comment({
        text: "Попробовал ваш рецепт, но добавил немного грибов. Получилось замечательно!",
        recipe: recipe1._id,
        author: john._id,
    });
    await comment2.save();

    const comment3 = new Comment({
        text: "Идеальное сочетание свежих овощей. Очень освежает в жаркий день!",
        recipe: recipe2._id,
        author: john._id,
    });
    await comment3.save();

    const comment4 = new Comment({
        text: "Как раз то, что нужно при простуде. Очень согревает и придает сил!",
        recipe: recipe3._id,
        author: jane._id,
    });
    await comment4.save();

    const comment5 = new Comment({
        text: "Брауни получился просто божественным! Такая шоколадная текстура...",
        recipe: recipe4._id,
        author: john._id,
    });
    await comment5.save();

    console.log('Fixtures created successfully!');
    console.log('Users:', await User.countDocuments());
    console.log('Recipes:', await Recipe.countDocuments());
    console.log('Comments:', await Comment.countDocuments());

    await db.close();
};

run().catch(console.error);