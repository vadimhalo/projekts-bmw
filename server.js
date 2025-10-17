const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();  // Загрузка .env для безопасности

const app = express();
const PORT = 3000;

// Подключение к MongoDB из .env
mongoose.connect(process.env.MONGODB_URI, { })
  .then(() => console.log('MongoDB подключена!'))  // Успешное подключение
  .catch(err => console.error('Ошибка MongoDB:', err));  // В случае ошибки

// Схема для BMW моделей
const carSchema = new mongoose.Schema({
  model: String,  // Название модели
  year: Number,   // Год
  description: {  // Описание с языками (~50 слов)
    lv: String,   // Латышский
    ru: String    // Русский
  },
  image: String   // URL изображения
});
const Car = mongoose.model('Car', carSchema);  // Создание модели

// Схема для запчастей (name теперь билингвальное)
const partSchema = new mongoose.Schema({
  name: {  // Название с языками
    lv: String,   // Латышский
    ru: String    // Русский
  },
  description: {  // Описание с языками (~50 слов)
    lv: String,   // Латышский
    ru: String    // Русский
  },
  image: String   // URL изображения
});
const Part = mongoose.model('Part', partSchema);  // Создание модели

// Инициализация данных (очистка и вставка с проверкой)
async function initData() {
  try {
    console.log('Начинаю инициализацию...');
    await Car.deleteMany({});  // Очистить старые данные машин
    await Part.deleteMany({}); // Очистить старые данные запчастей
    
    // Вставка 10 машин (без изменений)
    const carsData = [  // Определяем массив для ясности
      { 
        model: 'BMW M3', 
        year: 2023, 
        description: { 
          lv: 'BMW M3 ir ikonisks sporta sedans, kas debitēja 1986. gadā kā E30 sērija, piedāvājot revolucionāru veiktspēju. 2023. gada modelis ar 3.0 litru twin-turbo I6 dzinēju attīsta 473 ZS, paātrinoties līdz 100 km/h tikai 3.4 sekundēs. xDrive pilnpiedziņa un adaptīvā M balstiekārta nodrošina līdzsvaru starp komfortu un dinamiku. Interjerā — iDrive 8 sistēma. Ideāls entuziastiem ar maksimālo ātrumu 250 km/h.', 
          ru: 'BMW M3 — иконический спортивный седан, дебютировавший в 1986 году как серия E30, предлагая революционную производительность. Модель 2023 года с 3.0-литровым twin-turbo I6 двигателем развивает 473 л.с., разгоняясь до 100 км/ч за 3.4 секунды. xDrive полный привод и адаптивная M-подвеска обеспечивают баланс комфорта и динамики. В интерьере — iDrive 8. Идеален для энтузиастов с максимальной скоростью 250 км/ч.'
        }, 
        image: '/images/m3.jpg'  // Локальный путь
      },
      { 
        model: 'BMW X5', 
        year: 2024, 
        description: { 
          lv: 'BMW X5 debitēja 1999. gadā kā pirmais BMW SUV, apvienojot luksusa sedana komfortu ar off-road spēju. 2024. gada modelis ar 3.0 litru dzinēju (līdz 375 ZS), xDrive pilnpiedziņu un adaptīvo balstiekārtu piedāvā 8 ātrumkārbu un 48V hibrīda atbalstu. Interjerā — panorāmas jumts un Harman Kardon audio. Bagāžnieks 650–1870 litri, vilkšanas spēja 3500 kg. Premium SUV tirgus līderis ģimenēm.', 
          ru: 'BMW X5 дебютировал в 1999 году как первый SUV BMW, сочетая комфорт люксового седана с off-road возможностями. Модель 2024 года с 3.0-литровым двигателем (до 375 л.с.), xDrive полным приводом и адаптивной подвеской предлагает 8-ступенчатую АКПП и 48V гибридную поддержку. В интерьере — панорамная крыша и Harman Kardon. Багажник 650–1870 л, буксировка 3500 кг. Премиум SUV для семей.'
        }, 
        image: '/images/x5.jpg'  // Локальный путь
      },
      { 
        model: 'BMW 3 Series', 
        year: 2022, 
        description: { 
          lv: 'BMW 3 Series, leģendāra kompaktklases sedans kopš 1975. gada E21, definē "Ultimate Driving Machine" filozofiju. G20 2022. gada modelis ar 2.0 litru turbo dzinēju (līdz 258 ZS), aizmugures vai xDrive piedziņu un 8 ātrumkārbu. Digitālais kokpits ar 12.3 collu ekrāniem, Head-Up displejs un bezvadu uzlāde. Bagāžnieks 480 litri, patēriņš 6-7 l/100km un drošības sistēmas kā sadursmes brīdinājums. Best-seller biznesa segmentā ar maksimālo ātrumu 250 km/h.', 
          ru: 'BMW 3 Series, легендарный компактный седан с 1975 года E21, определяет философию "Ultimate Driving Machine". Модель G20 2022 года с 2.0-литровым турбомотором (до 258 л.с.), задним или xDrive приводом и 8-ступенчатой АКПП. Цифровой кокпит с 12.3-дюймовыми экранами, Head-Up дисплей и беспроводная зарядка. Багажник 480 л, расход 6-7 л/100 км и системы безопасности, как предупреждение столкновений. Бестселлер бизнес-сегмента с максимальной скоростью 250 км/ч.'
        }, 
        image: '/images/3series.jpg'  // Локальный путь
      },
      { 
        model: 'BMW i4', 
        year: 2023, 
        description: { 
          lv: 'BMW i4, elektrisks gran kupē kopš 2021. gada, apvieno kupeja stilu ar sedana komfortu un nulles emisijām. eDrive40 ar 340 ZS no diviem elektromotoriem, 81 kWh akumulatoru (590 km diapazons WLTP) un aizmugures piedziņu. Curved Display ar 14.9 collu ekrāniem, ātra uzlāde (205 kW DC). Paātrinājums 5.7 s līdz 100 km/h, maks. ātrums 190 km/h. Nākotnes BMW bez izplūdes gāzēm.', 
          ru: 'BMW i4, электрический гран-купе с 2021 года, сочетает стиль купе с комфортом седана и нулевыми выбросами. eDrive40 с 340 л.с. от двух электромоторов, 81 кВт·ч батареей (590 км WLTP) и задним приводом. Curved Display с 14.9-дюймовыми экранами, быстрая зарядка (205 кВт DC). Разгон 5.7 с до 100 км/ч, макс. скорость 190 км/ч. Будущее BMW без выхлопов.'
        }, 
        image: '/images/i4.jpg'  // Локальный путь
      },
      // Новые 6 моделей
      { 
        model: 'BMW 5 Series', 
        year: 2024, 
        description: { 
          lv: 'BMW 5 Series, luksusa bizness sedans kopš 1972. gada, piedāvā progresīvu tehnoloģiju un dinamisku braukšanu. G60 2024. gada modelis ar 2.0 litru turbo (līdz 286 ZS), xDrive un 8 ātrumkārbu. Curved Display, adaptīvā balstiekārta un autonomā braukšana. Bagāžnieks 520 litri, patēriņš 5-6 l/100km. Ideāls izpilddirektoru segmentā ar ātrumu līdz 250 km/h.', 
          ru: 'BMW 5 Series, люксовый бизнес-седан с 1972 года, предлагает прогрессивные технологии и динамичное вождение. Модель G60 2024 года с 2.0-литровым турбо (до 286 л.с.), xDrive и 8-ступенчатой АКПП. Curved Display, адаптивная подвеска и автономное вождение. Багажник 520 л, расход 5-6 л/100 км. Идеален для топ-менеджеров с скоростью до 250 км/ч.'
        }, 
        image: '/images/5series.jpg' 
      },
      { 
        model: 'BMW 7 Series', 
        year: 2023, 
        description: { 
          lv: 'BMW 7 Series, flagmaņu sedans kopš 1977. gada, simbolizē luksusu un inovācijas. G70 2023. gada modelis ar 3.0 litru hibrīdu (līdz 489 ZS), xDrive un 8 ātrumkārbu. Executive Lounge, Bowers & Wilkins audio un Executive Drive Pro. Bagāžnieks 540 litri, patēriņš 7 l/100km. Premium luksusa līderis ar ātrumu 250 km/h.', 
          ru: 'BMW 7 Series, флагманский седан с 1977 года, символизирует роскошь и инновации. Модель G70 2023 года с 3.0-литровым гибридом (до 489 л.с.), xDrive и 8-ступенчатой АКПП. Executive Lounge, Bowers & Wilkins аудио и Executive Drive Pro. Багажник 540 л, расход 7 л/100 км. Премиум-люкс лидер с скоростью 250 км/ч.'
        }, 
        image: '/images/7series.jpg' 
      },
      { 
        model: 'BMW X3', 
        year: 2024, 
        description: { 
          lv: 'BMW X3, kompaktklases SUV kopš 2003. gadā, apvieno sportiskumu un praktiskumu. 2024. gada modelis ar 2.0 litru turbo (līdz 255 ZS), xDrive un 8 ātrumkārbu. Adaptīvā balstiekārta, panorāmas jumts un M Sport pakete. Bagāžnieks 550 litri, vilkšana 2400 kg. Populārs ģimenes SUV ar ātrumu 235 km/h.', 
          ru: 'BMW X3, компактный SUV с 2003 года, сочетает спорт и практичность. Модель 2024 года с 2.0-литровым турбо (до 255 л.с.), xDrive и 8-ступенчатой АКПП. Адаптивная подвеска, панорамная крыша и M Sport пакет. Багажник 550 л, буксировка 2400 кг. Популярный семейный SUV с скоростью 235 км/ч.'
        }, 
        image: '/images/x3.jpg' 
      },
      { 
        model: 'BMW X7', 
        year: 2023, 
        description: { 
          lv: 'BMW X7, luksusa SUV kopš 2018. gada, piedāvā 7 sēdvietas un augstākās klases komfortu. 2023. gada modelis ar 3.0 litru dīzeli (līdz 400 ZS), xDrive un 8 ātrumkārbu. Crystal Headlights, Bowers & Wilkins un Executive Lounge. Bagāžnieks 326–2120 litri, vilkšana 3500 kg. Luksusa ģimenes SUV ar ātrumu 250 km/h.', 
          ru: 'BMW X7, люксовый SUV с 2018 года, предлагает 7 мест и высший комфорт. Модель 2023 года с 3.0-литровым дизелем (до 400 л.с.), xDrive и 8-ступенчатой АКПП. Crystal Headlights, Bowers & Wilkins и Executive Lounge. Багажник 326–2120 л, буксировка 3500 кг. Люксовый семейный SUV с скоростью 250 км/ч.'
        }, 
        image: '/images/x7.jpg' 
      },
      { 
        model: 'BMW Z4', 
        year: 2023, 
        description: { 
          lv: 'BMW Z4, roadster kopš 2002. gada, piedāvā atvērtu braukšanas prieku. 2023. gada modelis ar 3.0 litru turbo (līdz 382 ZS), aizmugures piedziņu un 8 ātrumkārbu. M Sport bremzes, adaptīvā balstiekārta un kabriolet jumts. Paātrinājums 4.5 s līdz 100 km/h. Sportisks roadster ar ātrumu 250 km/h.', 
          ru: 'BMW Z4, родстер с 2002 года, предлагает открытое удовольствие от вождения. Модель 2023 года с 3.0-литровым турбо (до 382 л.с.), задним приводом и 8-ступенчатой АКПП. M Sport тормоза, адаптивная подвеска и кабриолет-крыша. Разгон 4.5 с до 100 км/ч. Спортивный родстер с скоростью 250 км/ч.'
        }, 
        image: '/images/z4.jpg' 
      },
      { 
        model: 'BMW iX', 
        year: 2024, 
        description: { 
          lv: 'BMW iX, elektrisks SUV kopš 2021. gada, apvieno ilgtspējību un luksusu. 2024. gada modelis ar diviem motoriem (līdz 523 ZS), xDrive un 111 kWh akumulatoru (630 km WLTP). Curved Display, ātra uzlāde un Bowers & Wilkins. Bagāžnieks 500 litri, paātrinājums 4.6 s. Nākotnes elektriskais SUV ar ātrumu 250 km/h.', 
          ru: 'BMW iX, электрический SUV с 2021 года, сочетает устойчивость и роскошь. Модель 2024 года с двумя моторами (до 523 л.с.), xDrive и 111 кВт·ч батареей (630 км WLTP). Curved Display, быстрая зарядка и Bowers & Wilkins. Багажник 500 л, разгон 4.6 с. Будущий электрический SUV с скоростью 250 км/ч.'
        }, 
        image: '/images/ix.jpg' 
      }
    ];
    const insertedCars = await Car.insertMany(carsData);  // Исправлено: вставка из массива и присвоение результата
    console.log(`Вставлено машин: ${insertedCars.length}/10`);

    // Вставка 10 запчастей (билингвальные name, полные описания LV/RU)
    const partsData = [
      { 
        name: { 
          lv: 'Bremžu diski', 
          ru: 'Тормозные диски' 
        },
        description: { 
          lv: 'BMW oriģinālie priekšējie un aizmugurējie torozu diski nodrošina optimālu bremzēšanas veiktspēju. Izgatavoti no augstas kvalitātes tērauda, ar perforāciju siltuma izkliedi. Piemēroti visām sērijām, kalpo līdz 50 000 km. Nodrošina īsu bremzēšanas ceļu un izturību pret koroziju. Komplektā ar uzgriežņiem un vadlīnijām uzstādīšanai.', 
          ru: 'Оригинальные BMW передние и задние тормозные диски обеспечивают оптимальную тормозную производительность. Изготовлены из высококачественной стали с перфорацией для отвода тепла. Подходят для всех серий, служат до 50 000 км. Обеспечивают короткий тормозной путь и стойкость к коррозии. В комплекте с гайками и инструкцией по установке.'
        }, 
        image: '/images/part-brakes.jpg' 
      },
      { 
        name: { 
          lv: 'Eļļas filtrs', 
          ru: 'Масляный фильтр' 
        },
        description: { 
          lv: 'BMW oriģināls eļļas filtrs aiztur netīrumus un aizsargā dzinēju no nodiluma. Augsta filtrēšanas efektivitāte, silikona blīves un sintētisks materiāls. Piemērots 3-7 sērijām, maiņa ik 15 000 km. Nodrošina tīru eļļu, samazina patēriņu un pagarina dzinēja mūžu. Komplektā ar O-gredzenu un uzstādīšanas rīku.', 
          ru: 'Оригинальный BMW масляный фильтр задерживает загрязнения и защищает двигатель от износа. Высокая эффективность фильтрации, силиконовые уплотнители и синтетический материал. Подходит для 3-7 серий, замена каждые 15 000 км. Обеспечивает чистое масло, снижает расход и продлевает срок службы двигателя. В комплекте с O-кольцом и инструментом установки.'
        }, 
        image: '/images/part-oilfilter.jpg' 
      },
      { 
        name: { 
          lv: 'Aizdedzes sveces', 
          ru: 'Свечи зажигания' 
        },
        description: { 
          lv: 'BMW irīdija sveces nodrošina stabilu aizdedzi un ekonomiju. Ilgs kalpošanas laiks līdz 100 000 km, aukstās startēšanas labākā veiktspēja un samazinātas emisijas. Piemērotas benzīna dzinējiem visās sērijās. Uzlabo jaudu un samazina vibrāciju. Komplekts 4 gabalos ar uzstādīšanas pamācību.', 
          ru: 'Иридиевые BMW свечи зажигания обеспечивают стабильное зажигание и экономию. Долгий срок службы до 100 000 км, лучшая работа на холодном запуске и сниженные выбросы. Подходят для бензиновых двигателей всех серий. Повышают мощность и снижают вибрацию. Комплект 4 шт. с инструкцией по установке.'
        }, 
        image: '/images/part-sparkplugs.jpg' 
      },
      { 
        name: { 
          lv: 'Gaisa filtrs', 
          ru: 'Воздушный фильтр' 
        },
        description: { 
          lv: 'BMW oriģināls gaisa filtrs aiztur putekļus un uzlabo gaisa plūsmu dzinējā. Papīra elements ar augstu efektivitāti un ūdensizturību. Maiņa ik 30 000 km, piemērots visām sērijām. Palielina jaudu, ekonomiju un aizsargā pret netīrumiem. Viegli uzstādāms bez speciāliem rīkiem.', 
          ru: 'Оригинальный BMW воздушный фильтр задерживает пыль и улучшает поток воздуха в двигатель. Бумажный элемент с высокой эффективностью и водостойкостью. Замена каждые 30 000 км, подходит для всех серий. Увеличивает мощность, экономию и защищает от загрязнений. Легко устанавливается без специальных инструментов.'
        }, 
        image: '/images/part-airfilter.jpg' 
      },
      { 
        name: { 
          lv: 'Laika josta', 
          ru: 'Ремень ГРМ' 
        },
        description: { 
          lv: 'BMW laika jostu komplekts ar rullīšiem nodrošina precīzu laika sadalīšanu un klusu darbību. Izgatavots no kevlara, kalpo līdz 100 000 km. Piemērots 3-5 sērijām, novērš dzinēja bojājumus. Komplektā ar spiediena rullīti, blīvēm un uzstādīšanas vadlīnijām.', 
          ru: 'Комплект BMW ремня ГРМ с роликами обеспечивает точный газораспределение и тихую работу. Изготовлен из кевлара, служит до 100 000 км. Подходит для 3-5 серий, предотвращает повреждения двигателя. В комплекте с натяжным роликом, уплотнителями и инструкцией по установке.'
        }, 
        image: '/images/part-timingbelt.jpg' 
      },
      { 
        name: { 
          lv: 'Amortizatori', 
          ru: 'Амортизаторы' 
        },
        description: { 
          lv: 'BMW adaptīvie amortizatori nodrošina komfortu un dinamiku dažādos ceļa apstākļos. Gāzes spiediena tehnoloģija, piemērota xDrive modeļiem. Maiņa pāros, kalpo 80 000 km. Uzlabo vadāmību un samazina vibrāciju. Komplekts priekšējiem ar uzstādīšanas pamācību.', 
          ru: 'Адаптивные BMW амортизаторы обеспечивают комфорт и динамику на разных дорогах. Технология газового давления, подходит для xDrive моделей. Замена парами, служат 80 000 км. Улучшают управляемость и снижают вибрацию. Комплект передних с инструкцией по установке.'
        }, 
        image: '/images/part-shocks.jpg' 
      },
      { 
        name: { 
          lv: 'Degvielas filtrs', 
          ru: 'Топливный фильтр' 
        },
        description: { 
          lv: 'BMW oriģināls degvielas filtrs aiztur netīrumus un aizsargā sūkni no bojājumiem. Augsta caurlaidība un korozijas aizsardzība, maiņa ik 60 000 km. Piemērots dīzeļa un benzīna dzinējiem. Nodrošina stabilu padevi un samazina patēriņu. Viegla uzstādīšana.', 
          ru: 'Оригинальный BMW топливный фильтр задерживает загрязнения и защищает насос от повреждений. Высокая пропускная способность и антикоррозийная защита, замена каждые 60 000 км. Подходит для дизельных и бензиновых двигателей. Обеспечивает стабильную подачу и снижает расход. Легкая установка.'
        }, 
        image: '/images/part-fuelfilter.jpg' 
      },
      { 
        name: { 
          lv: 'Akumulators', 
          ru: 'Аккумулятор' 
        },
        description: { 
          lv: 'BMW AGM akumulators ar 90 Ah jaudu nodrošina ātru startu un stabilu strāvu. Pretvibrācijas tehnoloģija un aukstuma izturība, kalpo 5 gadus. Piemērots hibrīdiem un elektriskiem modeļiem. Viegli uzstādāms ar polāru aizsardzību.', 
          ru: 'BMW AGM аккумулятор с 90 Ah обеспечивает быстрый запуск и стабильный ток. Антивибрационная технология и морозостойкость, служит 5 лет. Подходит для гибридов и электромобилей. Легко устанавливается с полярной защитой.'
        }, 
        image: '/images/part-battery.jpg' 
      },
      { 
        name: { 
          lv: 'Bremžu lapiņas', 
          ru: 'Колодки тормозные' 
        },
        description: { 
          lv: 'BMW keramiskās bremžu lapiņas nodrošina klusu bremzēšanu un izturību pret karstumu. Bez putekļiem un trokšņiem, kalpo 40 000 km. Piemērotas M sērijām un SUV. Samazina nodilumu un uzlabo drošību. Komplekts ar sensoriem.', 
          ru: 'Керамические BMW тормозные колодки обеспечивают тихое торможение и стойкость к нагреву. Без пыли и шума, служат 40 000 км. Подходят для M серий и SUV. Снижают износ и повышают безопасность. Комплект с датчиками.'
        }, 
        image: '/images/part-pads.jpg' 
      },
      { 
        name: { 
          lv: 'Dzesēšanas radiatoris', 
          ru: 'Радиатор охлаждения' 
        },
        description: { 
          lv: 'BMW alumīnija radiatora nodrošina efektīvu dzesēšanu un izturību pret koroziju. Ar paplašinātu virsmu un ventilatora atbalstu, maiņa ik 100 000 km. Piemērots visām sērijām, novērš pārkaršanu. Komplektā ar vārstu un uzstādīšanas vadlīnijām.', 
          ru: 'Алюминиевый BMW радиатор охлаждения обеспечивает эффективное охлаждение и стойкость к коррозии. С расширенной поверхностью и поддержкой вентилятора, замена каждые 100 000 км. Подходит для всех серий, предотвращает перегрев. В комплекте с клапаном и инструкцией по установке.'
        }, 
        image: '/images/part-radiator.jpg' 
      }
    ];
    const insertedParts = await Part.insertMany(partsData);
    console.log(`Вставлено запчастей: ${insertedParts.length}/10`);

    console.log('Все данные вставлены!');
  } catch (err) {
    console.error('Ошибка инициализации:', err);
  }
}
initData();  // Запуск

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API для машин (без изменений)
app.get('/api/cars', async (req, res) => {
  try {
    const lang = req.query.lang || 'lv';
    const cars = await Car.find();
    const translated = cars.map(c => ({
      ...c._doc,
      description: c.description[lang] || c.description.lv
    }));
    res.json(translated);
  } catch (err) {
    console.error('API ошибка /cars:', err);
    res.status(500).json({ error: 'Ошибка загрузки данных' });
  }
});

app.get('/api/car/:id', async (req, res) => {
  try {
    const lang = req.query.lang || 'lv';
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Машина не найдена' });
    res.json({
      ...car._doc,
      description: car.description[lang] || car.description.lv
    });
  } catch (err) {
    console.error('API ошибка /car:', err);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

// API для запчастей (обновлено для name[lang])
app.get('/api/parts', async (req, res) => {
  try {
    const lang = req.query.lang || 'lv';
    const parts = await Part.find();
    const translated = parts.map(p => ({
      ...p._doc,
      name: p.name[lang] || p.name.lv,
      description: p.description[lang] || p.description.lv
    }));
    res.json(translated);
  } catch (err) {
    console.error('API ошибка /parts:', err);
    res.status(500).json({ error: 'Ошибка загрузки данных' });
  }
});

app.get('/api/part/:id', async (req, res) => {
  try {
    const lang = req.query.lang || 'lv';
    const part = await Part.findById(req.params.id);
    if (!part) return res.status(404).json({ error: 'Запчасть не найдена' });
    res.json({
      ...part._doc,
      name: part.name[lang] || part.name.lv,
      description: part.description[lang] || part.description.lv
    });
  } catch (err) {
    console.error('API ошибка /part:', err);
    res.status(500).json({ error: 'Ошибка загрузки' });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен http://localhost:${PORT}`));