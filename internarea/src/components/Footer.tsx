import { Facebook, Twitter, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">

        {/* TOP GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FooterSection
            title={t("footer.internshipByPlaces")}
            items={t("footer.places", { returnObjects: true })}
          />

          <FooterSection
            title={t("footer.internshipByStream")}
            items={t("footer.company", { returnObjects: true })}
          />

          <FooterSection
            title={t("footer.jobPlaces")}
            items={t("footer.resources", { returnObjects: true })}
            links
          />

          <FooterSection
            title={t("footer.jobsByStreams")}
            items={t("footer.industries", { returnObjects: true })}
            links
          />
        </div>

        <hr className="my-10 border-gray-600" />

        {/* SECOND GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FooterSection
            title={t("footer.aboutUs")}
            items={t("footer.simple", { returnObjects: true })}
            links
          />

          <FooterSection
            title={t("footer.teamDiary")}
            items={t("footer.simple", { returnObjects: true })}
            links
          />

          <FooterSection
            title={t("footer.terms")}
            items={t("footer.simple", { returnObjects: true })}
            links
          />

          <FooterSection
            title={t("footer.sitemap")}
            items={t("footer.simpleOne", { returnObjects: true })}
            links
          />
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center">
          <p className="flex items-center gap-2 border border-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
            <i className="bi bi-google-play"></i>
            {t("footer.getAndroidApp")}
          </p>

          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Facebook className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <Twitter className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <Instagram className="w-6 h-6 hover:text-pink-400 cursor-pointer" />
          </div>

          <p className="mt-4 sm:mt-0 text-sm text-gray-400">
            {t("footer.copyright")}
          </p>
        </div>

      </div>
    </footer>
  );
}

function FooterSection({ title, items, links }: any) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-300">{title}</h3>

      <div className="flex flex-col items-start mt-4 space-y-3">
        {items.map((item: any, index: any) =>
          links ? (
            <a
              key={index}
              href="/"
              className="text-gray-400 hover:text-blue-400 hover:underline"
            >
              {item}
            </a>
          ) : (
            <p
              key={index}
              className="text-gray-400 hover:text-blue-400 hover:underline cursor-pointer"
            >
              {item}
            </p>
          )
        )}
      </div>
    </div>
  );
}