import os from "os"; //os 레벨 접근
//test code
const getCpuUsage = () => {
  const cpus = os.cpus();

  let user = 0;
  let nice = 0;
  let sys = 0;
  let idle = 0;
  let irq = 0;

  for(let cpu of cpus){
    user += cpu.times.user;
    nice += cpu.times.nice; //user 모드 일종??
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq; //인터럽트 요청 시간
  }

  const total = user + nice + sys + idle + irq;

  return {
    user: ((user / total) * 100).toFixed(2), //사용자 모드 소비 시간
    sys: ((sys / total) * 100).toFixed(2), //시스템 모드 또는 커널모드 사용 시간
    idle: ((idle / total) * 100).toFixed(2), //무작업 대기시간
  };
};

export const getSystemInfo = () => {
  const totalMem = os.totalmem();
  const freeMem = os.totalmem();

  return{
    platform: os.platform(),
    arch: os.arch(),
    cpuCount: os.cpus().length,
    uptime: os.uptime(),
    memory: {
      total: totalMem,
      free: freeMem,
      used: totalMem - freeMem,
      usagePercent: (((totalMem - freeMem) / totalMem) * 100).toFixed(2),
      cpu: getCpuUsage(),
    },
  };
};
