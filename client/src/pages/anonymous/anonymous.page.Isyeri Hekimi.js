import React, { Fragment } from 'react';
import './anonymous.page.hizmetler.scss'

const IsyeriHekimi = () => {

  return (
    <Fragment>
      <div id='h-wrapper'>
        <div className='header'>
          <h2 >İşyeri Hekimliği</h2>
        </div>
        <div id='content'>
          <div id='content-wrapper'>
            <h3>İşyeri Hekimliği Nedir?</h3>
            <br />
            <p>
              İşyeri hekimliği, iş yerlerinde çalışanların sağlığını korumak ve geliştirmek amacıyla sunulan tıbbi hizmetler bütünüdür.
              İşyeri hekimleri, iş sağlığı ve güvenliği konusunda uzmanlaşmış doktorlardır. Görevleri, iş kazalarını ve meslek hastalıklarını önlemek,
              çalışanların sağlık sorunlarını erken teşhis etmek ve tedavi etmektir.
            </p>
            <br />
            <h3>İşyeri Hekiminin Görevleri</h3>
            <br />
            <span style={{ lineHeight: "2em", fontWeight: "500" }}>Sağlık Muayeneleri</span>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>İşe Giriş Muayeneleri:</span> Yeni işe başlayan çalışanların sağlık durumlarını değerlendirir ve işe uygunluklarını belirler.</li>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>Periyodik Sağlık Muayeneleri:</span> Çalışanların düzenli aralıklarla sağlık kontrollerini yapar ve sağlık durumlarını izler.</li>
            </ul>
            <br />
            <span style={{ lineHeight: "2em", fontWeight: "500" }}>Meslek Hastalıklarının Önlenmesi ve Erken Teşhis</span>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}>İş yerinde olası meslek hastalıklarını belirler ve önlemler alır.</li>
              <li style={{ paddingBottom: ".5em" }}>Çalışanların maruz kaldığı riskleri değerlendirir ve gerekli koruyucu önlemleri önerir.</li>
              <li style={{ paddingBottom: ".5em" }}>Erken teşhis ve tedavi için düzenli sağlık taramaları gerçekleştirir.</li>
            </ul>
            <br />
            <span style={{ lineHeight: "2em", fontWeight: "500" }}>Sağlık Eğitimi ve Bilinçlendirme</span>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}>Çalışanlara sağlıklı yaşam tarzı ve iş yerinde sağlık risklerinden korunma konusunda eğitimler verir.</li>
              <li style={{ paddingBottom: ".5em" }}>Sağlık bilincini artırarak, çalışanların kendi sağlıklarını koruma yeteneklerini geliştirir.</li>
            </ul>
            <br />
            <span style={{ lineHeight: "2em", fontWeight: "500" }}>Acil Durum Müdahalesi</span>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}>İş yerinde meydana gelen kazalara ve acil durumlara ilk müdahaleyi yapar.</li>
              <li style={{ paddingBottom: ".5em" }}>Acil durum ekipmanlarının kullanılabilirliğini ve çalışanların acil durum prosedürlerine uygun hareket etmesini sağlar.</li>
            </ul>
            <br />
            <span style={{ lineHeight: "2em", fontWeight: "500" }}>Sağlık Raporları ve Kayıtları</span>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}>Çalışanların sağlık durumlarıyla ilgili kayıtları tutar ve gerekli sağlık raporlarını hazırlar.</li>
              <li style={{ paddingBottom: ".5em" }}>İş kazaları ve meslek hastalıkları ile ilgili raporları düzenler ve ilgili mercilere iletir.</li>
            </ul>
            <br />
            <span style={{ lineHeight: "2em", fontWeight: "500" }}>İş Yeri Ortamının Sağlık ve Güvenlik Açısından Değerlendirilmesi</span>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}>İş yerinde sağlık ve güvenlik açısından tehlike oluşturan faktörleri belirler ve bu tehlikeleri ortadan kaldırmak için önerilerde bulunur.</li>
              <li style={{ paddingBottom: ".5em" }}>İş yerindeki fiziksel, kimyasal ve biyolojik riskleri değerlendirir ve çalışanların bu risklerden korunmasını sağlar.</li>
            </ul>
            <br />
            <h3>Neden İşyeri Hekimliği Hizmeti Almalısınız?</h3>
            <br />
            <p>
              İşyeri hekimliği hizmeti, çalışanların sağlığını koruyarak iş gücü kayıplarını azaltır ve iş yerinde verimliliği artırır. Sağlıklı bir iş gücü, iş yerinde daha
              az devamsızlık ve daha yüksek iş performansı demektir. Ayrıca, yasal zorunlulukların yerine getirilmesi ve iş kazalarının önlenmesi açısından iş yeri hekimliği
              hizmeti büyük önem taşır.
            </p>
            <br />
            <h3>Bizden Hizmet Almanızın Avantajları</h3>
            <br />
            <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>Uzman Kadro:</span> Alanında tecrübeli ve sertifikalı işyeri hekimlerimizle hizmet veriyoruz.</li>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>Kapsamlı Sağlık Muayeneleri:</span> Çalışanlarınızın sağlık durumlarını düzenli olarak izliyor ve değerlendiriyoruz.</li>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>Özelleştirilmiş Sağlık Çözümleri:</span> İş yerinizin ihtiyaçlarına göre özelleştirilmiş sağlık çözümleri geliştiriyoruz.</li>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>Eğitim ve Bilinçlendirme:</span> Çalışanlarınıza yönelik kapsamlı sağlık eğitimleri sunarak bilinçlendirmeyi sağlıyoruz.</li>
              <li style={{ paddingBottom: ".5em" }}><span style={{ fontWeight: "500" }}>Yasal Uygunluk:</span> İş yerinizin tüm yasal gerekliliklere uygun çalışmasını sağlıyoruz.</li>
            </ul>
            <br />
            <h3>Bizimle İletişime Geçin</h3>
            <br />
            <p>
              Çalışanlarınızın sağlığını korumak ve iş yerinizdeki verimliliği artırmak için bizimle iletişime geçin. Profesyonel işyeri hekimlerimiz, iş yerinizin daha sağlıklı ve güvenli hale gelmesi için sizinle birlikte çalışmaktan memnuniyet duyacaktır.
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default IsyeriHekimi;