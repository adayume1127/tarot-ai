import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | Luna Tarot',
  description: 'Luna Tarotのプライバシーポリシーです。個人情報の取り扱いについて説明します。',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #060010 0%, #0d0026 50%, #060010 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
            ← トップへ戻る
          </Link>
        </div>

        <h1 className="font-cinzel text-2xl md:text-3xl text-white mb-2">プライバシーポリシー</h1>
        <p className="text-purple-400 text-sm mb-10">最終更新日：2026年7月5日</p>

        <div className="space-y-8 text-purple-100 text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-base font-semibold mb-3">1. 基本方針</h2>
            <p>
              Luna Tarot（以下「本サービス」）は、ユーザーの個人情報の保護を重要な責務と考え、
              個人情報の保護に関する法律（個人情報保護法）を遵守し、適切な取り扱いを行います。
            </p>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">2. 収集する情報</h2>
            <p className="mb-2">本サービスでは、以下の情報を収集する場合があります。</p>
            <ul className="list-disc list-inside space-y-1 text-purple-200">
              <li>メールアドレス（アカウント登録時）</li>
              <li>占い履歴・入力内容（サービス提供のため）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報、閲覧ページ等）</li>
              <li>Cookie・類似技術による情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">3. 情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-1 text-purple-200">
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザーサポートへの対応</li>
              <li>サービスに関する重要なお知らせの送信</li>
              <li>利用規約違反への対応</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">4. 第三者への提供</h2>
            <p>
              本サービスは、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。
              ただし、以下のサービスを利用するにあたり、各社のポリシーに基づきデータが処理される場合があります。
            </p>
            <ul className="list-disc list-inside space-y-1 text-purple-200 mt-2">
              <li>Supabase（データベース・認証）</li>
              <li>Stripe（決済処理）</li>
              <li>Anthropic Claude API（AI鑑定生成）</li>
              <li>Vercel（ホスティング）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">5. Google AdSenseについて</h2>
            <p className="mb-2">
              本サービスでは、Google AdSenseを利用して広告を配信しています。
              Google AdSenseはCookieを使用して、ユーザーの興味に基づいた広告を表示します。
            </p>
            <ul className="list-disc list-inside space-y-1 text-purple-200">
              <li>Googleによる広告Cookieの使用により、以前の本サービスや他サイトへの訪問情報に基づいた広告が表示されます</li>
              <li>広告のパーソナライズはGoogleの広告設定ページから無効にできます</li>
              <li>詳細はGoogleの<a href="https://policies.google.com/privacy" className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>をご確認ください</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">6. Cookieについて</h2>
            <p>
              本サービスはCookieを使用しています。Cookieはブラウザの設定から無効にすることができますが、
              一部の機能が正常に動作しなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">7. アクセス解析</h2>
            <p>
              本サービスではGoogleサーチコンソールおよびVercel Analyticsを使用してアクセス状況を分析しています。
              これらのツールはCookieを使用しますが、個人を特定する情報は収集しません。
            </p>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">8. 個人情報の管理・削除</h2>
            <p>
              ユーザーは自身の個人情報の開示・訂正・削除を要求することができます。
              お問い合わせは下記メールアドレスまでご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">9. お問い合わせ</h2>
            <p>
              プライバシーポリシーに関するお問い合わせは、
              <span className="text-purple-300"> 11shouta11@gmail.com </span>
              までご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-white text-base font-semibold mb-3">10. ポリシーの変更</h2>
            <p>
              本ポリシーは必要に応じて改定することがあります。
              重要な変更がある場合はサービス上でお知らせします。
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-purple-900 text-center">
          <Link href="/" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
            ← Luna Tarot トップへ
          </Link>
        </div>

      </div>
    </div>
  )
}
