import { formatArea, getLevelDescription } from './responsePlan';
import { buildWordDocHtml } from './responsePlanDoc';

import type { ScenarioKey, SimulationResult } from './types';

// Structural subset of Map2DView's `DomainBounds` — only what the report
// prints, so this module doesn't import from the view layer.
export interface ImpactReportDomainBounds {
  southWest: { lat: number; lng: number };
  northEast: { lat: number; lng: number };
  widthKm: number;
  heightKm: number;
  areaKm2: number;
}

// Matches the scenario labels in pmbc_web's generateReportHtml().
const SCENARIO_REPORT_LABEL: Record<ScenarioKey, string> = {
  direct: 'Phát tán trực tiếp vào khí quyển',
  puddle: 'Bốc hơi từ vũng tràn chất lỏng trên mặt đất',
  tank_liquid_spreading: 'Bồn chứa rò rỉ chất lỏng và lan tỏa vũng tràn',
  tank_pressurized: 'Bồn chứa khí nén quá nhiệt / rò rỉ qua lỗ thủng',
  pipeline: 'Đứt / vỡ đường ống dẫn khí nén có ma sát',
};

// Matches pmbc_web's `generateReportHtml()` (mophongphattan.component.ts:
// 3055-3206) 1:1 — the "báo cáo chi tiết vùng ảnh hưởng" document body.
function generateImpactReportBody(
  result: SimulationResult,
  domainBounds: ImpactReportDomainBounds | null
): string {
  const chem = result.chem;
  const now = new Date();
  const dateFormatted = `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const scenarioLabel = SCENARIO_REPORT_LABEL[result.scenario] ?? SCENARIO_REPORT_LABEL.direct;

  const levelsRows = result.levels
    .map((lvl, idx) => {
      const locStr =
        lvl.loc_ppm != null ? `${lvl.loc_ppm} ppm` : `${(lvl.LOC_kg_m3 * 1e6).toFixed(2)} mg/m³`;
      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><strong style="color: ${lvl.stroke || '#f59e0b'};">${lvl.label}</strong></td>
          <td style="text-align: center;">${locStr}</td>
          <td style="text-align: right; font-weight: bold;">${lvl.xl > 0 ? lvl.xl.toFixed(0) + ' m' : 'Không đạt'}</td>
          <td style="text-align: right;">${lvl.xl > 0 ? formatArea(lvl.area) : '—'}</td>
          <td>${getLevelDescription(lvl.key)}</td>
        </tr>`;
    })
    .join('');

  const domainInfo = domainBounds
    ? `<p><strong>Miền mô phỏng đã khoanh:</strong> Diện tích <strong>${domainBounds.areaKm2.toFixed(2)} km²</strong> (${domainBounds.widthKm.toFixed(2)} km x ${domainBounds.heightKm.toFixed(2)} km) · Tọa độ Tây Nam: [${domainBounds.southWest.lat.toFixed(4)}, ${domainBounds.southWest.lng.toFixed(4)}] · Tọa độ Đông Bắc: [${domainBounds.northEast.lat.toFixed(4)}, ${domainBounds.northEast.lng.toFixed(4)}]</p>`
    : `<p><strong>Miền mô phỏng:</strong> Tính toán theo trường phát tán mở tự do (chưa gán khoanh chữ nhật cố định).</p>`;

  return `
    <table class="header-table">
      <tr>
        <td style="width: 48%; text-align: center;">
          <strong>BỘ QUỐC PHÒNG</strong><br>
          <strong>BINH CHỦNG HÓA HỌC</strong><br>
          <strong>TRUNG TÂM PHÒNG CHỐNG KHẨN CẤP</strong><br>
          --------------------
        </td>
        <td style="width: 52%; text-align: center;">
          <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
          <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
          --------------------------<br>
          <em>Hà Nội, ${dateFormatted}</em>
        </td>
      </tr>
    </table>

    <div class="title-box">
      <div class="main-title">BÁO CÁO KẾT QUẢ ĐÁNH GIÁ &amp; DỰ BÁO VÙNG ẢNH HƯỞNG PHÁT TÁN HÓA CHẤT ĐỘC</div>
      <div class="sub-title">(Thời điểm xuất báo cáo: ${timeFormatted} - Ngày ${dateFormatted})</div>
    </div>

    <h3>I. THÔNG TIN SỰ CỐ VÀ TÁC NHÂN NGUY HIỂM</h3>
    <table style="width: 100%;">
      <tr>
        <td style="width: 25%; background: #f9f9f9;"><strong>Hóa chất độc hại:</strong></td>
        <td style="width: 35%;"><strong>${chem.name}</strong></td>
        <td style="width: 20%; background: #f9f9f9;"><strong>Số hiệu CAS:</strong></td>
        <td style="width: 20%;">${chem.cas || 'N/A'}</td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Khối lượng phân tử:</strong></td>
        <td>${chem.mw} g/mol</td>
        <td style="background: #f9f9f9;"><strong>Áp suất hơi (VP):</strong></td>
        <td>${chem.vp_pa ? chem.vp_pa.toLocaleString('en-US') + ' Pa' : 'N/A'}</td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Khối lượng riêng lỏng:</strong></td>
        <td>${chem.rho_l} kg/m³</td>
        <td style="background: #f9f9f9;"><strong>Điểm sôi (BP):</strong></td>
        <td>${chem.bp_K ? (chem.bp_K - 273.15).toFixed(1) + ' °C (' + chem.bp_K + ' K)' : 'N/A'}</td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Tọa độ nguồn phát:</strong></td>
        <td>Vĩ độ: ${result.sourceLat.toFixed(5)}°B, Kinh độ: ${result.sourceLon.toFixed(5)}°Đ</td>
        <td style="background: #f9f9f9;"><strong>Kịch bản sự cố:</strong></td>
        <td>${scenarioLabel}</td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Lưu lượng phát thải đỉnh:</strong></td>
        <td><strong>${result.Qpeak.toFixed(4)} kg/s</strong></td>
        <td style="background: #f9f9f9;"><strong>Mô hình khí động:</strong></td>
        <td><strong>${result.model === 'heavy_gas' ? 'Khí nặng (DEGADIS)' : 'Gauss (Khí trung tính)'}</strong> (Ric* = ${result.Ric.toFixed(3)})</td>
      </tr>
    </table>

    <h3>II. ĐIỀU KIỆN KHÍ TƯỢNG VÀ KHÍ QUYỂN</h3>
    <table style="width: 100%;">
      <tr>
        <td style="width: 25%; background: #f9f9f9;"><strong>Tốc độ gió (U10):</strong></td>
        <td style="width: 25%;">${result.U10} m/s</td>
        <td style="width: 25%; background: #f9f9f9;"><strong>Hướng gió thổi tới:</strong></td>
        <td style="width: 25%;"><strong>${result.windDirTo}°</strong></td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Cấp ổn định khí quyển:</strong></td>
        <td><strong>Cấp ${result.stability} (Pasquill-Gifford)</strong></td>
        <td style="background: #f9f9f9;"><strong>Nhiệt độ môi trường:</strong></td>
        <td>${(result.ambientTemp - 273.15).toFixed(1)} °C (${result.ambientTemp} K)</td>
      </tr>
    </table>

    <h3>III. BẢNG TỔNG HỢP VÙNG ĐE DỌA VÀ PHẠM VI ẢNH HƯỞNG</h3>
    <p>Tổng cự ly phát tán độc hại xa nhất ghi nhận: <strong>${result.xl.toFixed(1)} mét</strong>. Bề rộng đám mây độc hại lớn nhất: <strong>${(2 * result.maxHalfwidth).toFixed(1)} mét</strong>. Tổng diện tích nhiễm độc dự kiến: <strong>${formatArea(result.maxArea)}</strong>.</p>

    <table>
      <thead>
        <tr>
          <th style="width: 5%;">TT</th>
          <th style="width: 22%;">Phân cấp vùng nguy hiểm</th>
          <th style="width: 15%;">Ngưỡng nồng độ</th>
          <th style="width: 15%;">Cự ly xa nhất</th>
          <th style="width: 15%;">Diện tích</th>
          <th style="width: 28%;">Mức độ nguy hại đối với con người</th>
        </tr>
      </thead>
      <tbody>${levelsRows}
      </tbody>
    </table>

    ${domainInfo}

    <h3>IV. KHUYẾN CÁO TÁC CHIẾN VÀ BIỆN PHÁP ỨNG PHÓ KHẨN CẤP</h3>
    <ul>
      <li><strong>Bán kính cách ly ban đầu:</strong> Ngay lập tức thiết lập ranh giới cô lập tối thiểu <strong>${Math.max(100, Math.round(result.xl * 0.15))}m</strong> tính từ tâm nguồn rò rỉ theo mọi hướng. Không cho người không có nhiệm vụ tiếp cận khu vực.</li>
      <li><strong>Phương án sơ tán dân cư &amp; lực lượng:</strong> Sơ tán khẩn cấp toàn bộ người dân trong vùng AEGL-2 và AEGL-3. <strong>HƯỚNG DI CHUYỂN:</strong> Tuyệt đối không chạy xuôi theo chiều gió thổi (${result.windDirTo}°), cần di chuyển <strong>VUÔNG GÓC VỚI HƯỚNG GIÓ</strong> (hướng ${((result.windDirTo + 90) % 360).toFixed(0)}° hoặc ${((result.windDirTo + 270) % 360).toFixed(0)}°) và tìm đến các vị trí địa hình cao ráo, thoáng khí.</li>
      <li><strong>Trang bị phòng hộ cá nhân:</strong> Lực lượng cứu nạn cứu hộ và tiếp cận hiện trường bắt buộc mang khí tài phòng hóa cách ly toàn thân (Bộ đồ tiêu chuẩn cấp độ A/B kèm bình dưỡng khí thở độc lập SCBA). Nhân dân tại chỗ cần dùng khăn ẩm che kín mũi miệng, đóng kín toàn bộ cửa kính và hệ thống điều hòa thông gió.</li>
      <li><strong>Biện pháp chuyên môn Binh chủng Hóa học:</strong> Sử dụng xe chuyên dụng phun sương màn nước hoặc hóa chất trung hòa kiềm/axit để dập mây hơi khí độc, dùng đê cát ngăn chặn vũng tràn lỏng phát tán ra môi trường nước.</li>
    </ul>

    <table class="sign-table">
      <tr>
        <td style="width: 50%;">
          <strong>NGƯỜI LẬP BÁO CÁO</strong><br>
          <em>(Ký, ghi rõ họ tên)</em><br><br><br><br>
          <strong>Cán bộ Tác chiến / Kỹ thuật</strong>
        </td>
        <td style="width: 50%;">
          <strong>CHỈ HUY ĐƠN VỊ PHÊ DUYỆT</strong><br>
          <em>(Ký tên, đóng dấu)</em><br><br><br><br>
          <strong>Chỉ huy trưởng</strong>
        </td>
      </tr>
    </table>
  `;
}

// Matches pmbc_web's exportDetailedReportDocx() — same HTML-saved-as-.doc
// trick as the response plan export.
export function buildImpactReportDocHtml(
  result: SimulationResult,
  domainBounds: ImpactReportDomainBounds | null
): string {
  return buildWordDocHtml(
    'Báo cáo vùng ảnh hưởng phát tán hóa chất',
    generateImpactReportBody(result, domainBounds)
  );
}

// Web's name is `Bao_cao_vung_anh_huong_<chem>_<yyyy-mm-dd>.doc`; mobile
// appends Date.now() so a re-export never collides with a stale file in
// Downloads (Android scoped-storage EACCES, see HANDOFF §6.22).
export function buildImpactReportFileName(result: SimulationResult): string {
  const chemName = (result.chem.name || 'hoachat').replace(/[^a-zA-Z0-9]/g, '_');
  const nowStr = new Date().toISOString().slice(0, 10);
  return `Bao_cao_vung_anh_huong_${chemName}_${nowStr}_${Date.now()}.doc`;
}
