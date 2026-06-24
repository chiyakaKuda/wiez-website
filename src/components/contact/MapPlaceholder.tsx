const LATITUDE = -17.823466375403527;
const LONGITUDE = 31.049892655831957;

export default function MapPlaceholder() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-[28px] border border-navy/5 sm:h-80">
      <iframe
        title="WiEZ office location in Harare, Zimbabwe"
        src={`https://www.google.com/maps?q=${LATITUDE},${LONGITUDE}&z=15&output=embed`}
        className="absolute inset-0 h-full w-full grayscale-[0.35] contrast-[1.1]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-navy/5" />

      <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] sm:right-auto">
        <div>
          <p className="font-heading text-sm font-extrabold text-navy">
            WiEZ Head Office
          </p>
          <p className="mt-0.5 font-sans text-sm text-slate-custom">
            Harare, Zimbabwe
          </p>
        </div>
      </div>
    </div>
  );
}
