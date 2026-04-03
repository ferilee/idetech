import Image from "next/image";

export default function HomePage() {
  return (
    <main className="home">
      <div className="shell home-shell">
        <header className="home-nav">
          <div className="home-brand">
            <Image src="/logo.png" alt="IdeTech logo" width={44} height={44} />
            <span>IdeTech</span>
          </div>
          <nav className="home-links">
            <a href="#home">Beranda</a>
            <a href="#services">Fitur</a>
            <a href="#roles">Mode Peran</a>
            <a href="#ecosystem">Ekosistem</a>
            <a href="#contact">Kontak</a>
          </nav>
          <a className="home-cta" href="/login">
            Mulai
          </a>
        </header>

        <section className="home-hero" id="home">
          <div className="home-copy">
            <span className="home-kicker">Role-Based Interface</span>
            <h1>
              Platform Belajar <span>IdeTech</span>
            </h1>
            <p>
              IdeTech menyesuaikan pengalaman belajar untuk guru, siswa
              (SD/SMP/SMA/Umum), dan orang tua. Konten interaktif, gamifikasi,
              kolaborasi, dan analitik real-time hadir dalam satu alur.
            </p>
            <div className="home-actions">
              <a className="home-primary" href="/login">
                Coba Sekarang
              </a>
              <button className="home-secondary" type="button">
                Lihat Demo
              </button>
            </div>
            <div className="home-logos">
              <span>Dipercaya oleh komunitas pendidik Indonesia</span>
              <div className="logo-row">
                <span>Guru SD</span>
                <span>SMP</span>
                <span>SMA</span>
                <span>Orang Tua</span>
              </div>
            </div>
          </div>

          <div className="home-visual">
            <div className="laptop-frame">
              <div className="laptop-screen">
                <div className="screen-header">
                  <span>IdeTech</span>
                  <div className="screen-nav">
                    <span>IdeStudio</span>
                    <span>IdeQuest</span>
                    <span>Co-Lab</span>
                    <span>Radar</span>
                  </div>
                  <button type="button">Mulai</button>
                </div>
                <div className="screen-body">
                  <div className="screen-left">
                    <h3>Ubah materi jadi petualangan belajar</h3>
                    <p>
                      Unggah materi, pilih template, dan sajikan kuis,
                      flashcard, atau mini-game tanpa coding.
                    </p>
                    <button type="button">Buka IdeStudio</button>
                  </div>
                  <div className="screen-chart">
                    <span>+70% ketuntasan kelas</span>
                    <div className="chart-bars">
                      <div />
                      <div />
                      <div />
                      <div />
                    </div>
                  </div>
                </div>
              </div>
              <div className="laptop-base" />
            </div>
            <div className="desk-item phone" />
            <div className="desk-item plant" />
          </div>
        </section>

        <section className="home-services" id="services">
          <div className="service-card">
            <span>IdeStudio</span>
            <p>
              Upload materi otomatis jadi outline, lalu drag-and-drop template
              kuis, flashcard, dan mini-game.
            </p>
          </div>
          <div className="service-card active">
            <span>IdeQuest</span>
            <p>
              Quest map dengan IdePoin, badges, hint bertahap, remedial, dan
              pengayaan.
            </p>
          </div>
          <div className="service-card">
            <span>Co-Lab</span>
            <p>
              Ruang proyek dengan rubrik kontribusi, forum terkelola, dan kanvas
              real-time.
            </p>
          </div>
          <div className="service-card">
            <span>Bank Ide</span>
            <p>
              Marketplace RPP, kuis, dan game dengan kurasi, rating, dan review.
            </p>
          </div>
        </section>

        <section className="home-highlights">
          <div className="highlight-panel">
            <div className="highlight-header">
              <span>IdeStudio</span>
              <strong>Konten interaktif tanpa coding</strong>
            </div>
            <ul>
              <li>Konversi otomatis dari PDF/teks ke struktur materi.</li>
              <li>Template adaptif untuk soal bertingkat kesulitan.</li>
              <li>Quality check mendeteksi soal ambigu/duplikat.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="highlight-header">
              <span>IdeQuest</span>
              <strong>Gamifikasi yang terukur</strong>
            </div>
            <ul>
              <li>Jalur inti + pengayaan berdasarkan performa.</li>
              <li>Hint bertahap dan remedial otomatis.</li>
              <li>Streak mingguan untuk menjaga motivasi.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="highlight-header">
              <span>Co-Lab</span>
              <strong>Project-based learning</strong>
            </div>
            <ul>
              <li>Rubrik kontribusi dengan logging aktivitas.</li>
              <li>Template kanvas PBL untuk problem, ide, prototipe.</li>
              <li>Moderator tools untuk menjaga diskusi.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="highlight-header">
              <span>Bank Ide</span>
              <strong>Komunitas pendidik aktif</strong>
            </div>
            <ul>
              <li>Kurasi editor + tagging mapel/jenjang.</li>
              <li>Duplikasi cepat + edit instan.</li>
              <li>Insentif kredit untuk berbagi materi.</li>
            </ul>
          </div>
          <div className="highlight-panel">
            <div className="highlight-header">
              <span>Radar Pintar</span>
              <strong>Insight real-time</strong>
            </div>
            <ul>
              <li>Peta kesulitan konsep per kelas.</li>
              <li>Early warning siswa berisiko.</li>
              <li>Parent view ringkas dengan rekomendasi.</li>
            </ul>
          </div>
        </section>

        <section className="home-stats" id="roles">
          <div className="stat">
            <strong>Guru</strong>
            <span>IdeStudio & Bank Ide</span>
          </div>
          <div className="stat">
            <strong>Siswa</strong>
            <span>Quest map + reward</span>
          </div>
          <div className="stat">
            <strong>Orang Tua</strong>
            <span>Radar progres belajar</span>
          </div>
          <a className="home-quote" href="/login">
            Pilih Peran
          </a>
        </section>

        <footer className="home-footer" id="ecosystem">
          <span>IdeStudio</span>
          <span>IdeQuest</span>
          <span>Co-Lab</span>
          <span>Bank Ide</span>
          <span>Radar Pintar</span>
        </footer>

        <section className="home-radar">
          <div>
            <h2>Radar Pintar untuk intervensi dini</h2>
            <p>
              Sistem memantau waktu belajar, akurasi kuis, dan pola kesalahan.
              Guru dapat melihat 70% siswa kesulitan di konsep tertentu dan
              memberi tindak lanjut lebih cepat.
            </p>
          </div>
          <div className="radar-card">
            <span>Early Warning</span>
            <p>5 siswa butuh pendampingan pecahan</p>
            <div className="radar-bars">
              <div />
              <div />
              <div />
            </div>
          </div>
        </section>

        <div className="home-contact" id="contact">
          <p>
            Siap mencoba alur role-based untuk sekolahmu? IdeTech membantu guru
            membuat konten interaktif, siswa belajar lewat quest map, dan orang
            tua memantau progres real-time.
          </p>
          <a href="/login">Mulai dari dashboard IdeTech</a>
        </div>
      </div>
    </main>
  );
}
