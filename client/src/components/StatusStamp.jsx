const STATUS_STYLES = {
  applied: "border-slate-650 text-slate-650",
  "under review": "border-amber-stamp text-amber-stamp",
  shortlisted: "border-ledger text-ledger",
  hired: "border-ledger text-ledger bg-ledger/10",
  rejected: "border-rose-stamp text-rose-stamp",
  open: "border-ledger text-ledger",
  closed: "border-rose-stamp text-rose-stamp",
};

const StatusStamp = ({ status }) => {
  const style = STATUS_STYLES[status] || "border-slate-650 text-slate-650";
  return <span className={`stamp ${style}`}>{status}</span>;
};

export default StatusStamp;
