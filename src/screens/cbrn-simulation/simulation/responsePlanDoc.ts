import { getEvacBearing1, getEvacBearing2, getIsolationRadius } from './responsePlan';

import type { SimulationResult } from './types';

// Matches pmbc_web's `generateResponsePlanHtml()` (mophongphattan.
// component.ts:3565-3696) 1:1 — the actual "kế hoạch & phương án ứng phó"
// document body, shared by both web's DOCX export and its "In kế hoạch"
// print view.
function generateResponsePlanBody(result: SimulationResult): string {
  const chem = result.chem;
  const now = new Date();
  const dateFormatted = `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const isoRadius = getIsolationRadius(result);
  const evac1 = getEvacBearing1(result);
  const evac2 = getEvacBearing2(result);
  const cpBearing = Math.round((result.windDirTo + 180) % 360);

  return `
    <table class="header-table">
      <tr>
        <td style="width: 50%; text-align: center;">
          <strong>BỘ QUỐC PHÒNG</strong><br>
          <strong>BINH CHỦNG HÓA HỌC</strong><br>
          <strong>SỞ CHỈ HUY TÁC CHIẾN</strong><br>
          --------------------
        </td>
        <td style="width: 50%; text-align: center;">
          <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
          <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
          --------------------------<br>
          <em>Hà Nội, ${dateFormatted}</em>
        </td>
      </tr>
    </table>

    <div class="title-box">
      <div class="main-title">KẾ HOẠCH & PHƯƠNG ÁN ỨNG PHÓ SỰ CỐ KHẨN CẤP</div>
      <div class="sub-title">Tác nhân độc hại: ${chem.name} (Số CAS: ${chem.cas || 'N/A'}) - Ban hành hồi: ${timeFormatted}</div>
    </div>

    <h3>I. TÌNH HÌNH SỰ CỐ &amp; ĐÁNH GIÁ NGUY CƠ ĐỘC HẠI</h3>
    <table style="width: 100%;">
      <tr>
        <td style="width: 25%; background: #f9f9f9;"><strong>Hóa chất rò rỉ:</strong></td>
        <td style="width: 35%;"><strong>${chem.name}</strong></td>
        <td style="width: 20%; background: #f9f9f9;"><strong>Số hiệu CAS:</strong></td>
        <td style="width: 20%;">${chem.cas || 'N/A'}</td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Tọa độ nguồn phát:</strong></td>
        <td>${result.sourceLat.toFixed(5)}°B, ${result.sourceLon.toFixed(5)}°Đ</td>
        <td style="background: #f9f9f9;"><strong>Cự ly đe dọa tối đa:</strong></td>
        <td><strong>${result.xl.toFixed(0)} mét</strong></td>
      </tr>
      <tr>
        <td style="background: #f9f9f9;"><strong>Vận tốc / Hướng gió:</strong></td>
        <td>${result.U10} m/s (thổi tới hướng ${result.windDirTo}°)</td>
        <td style="background: #f9f9f9;"><strong>Cấp ổn định khí quyển:</strong></td>
        <td>Cấp ${result.stability} (Pasquill)</td>
      </tr>
    </table>

    <h3>II. VÀNH ĐAI CÁCH LY BAN ĐẦU &amp; PHƯƠNG ÁN SƠ TÁN DÂN CƯ</h3>
    <ul>
      <li><strong>Bán kính vành đai cách ly khẩn cấp ban đầu:</strong> Thiết lập vùng cách ly bán kính <strong>${isoRadius} mét</strong> bao quanh nguồn phát tán. Tuyệt đối không để bất kỳ người và phương tiện nào không có nhiệm vụ đi vào vùng cách ly.</li>
      <li><strong>Phương hướng sơ tán thoát hiểm khẩn cấp:</strong> Toàn bộ dân cư và lực lượng cứu nạn phải di chuyển <strong>VUÔNG GÓC VỚI CHIỀU GIÓ THỔI</strong> (hướng <strong>${evac1}°</strong> hoặc hướng <strong>${evac2}°</strong>). Tuyệt đối nghiêm cấm việc chạy xuôi theo hướng gió thổi (${result.windDirTo}°).</li>
      <li><strong>Địa hình sơ tán ưu tiên:</strong> Lựa chọn các vị trí địa hình cao, thoáng gió, các tòa nhà kiên cố đóng kín toàn bộ cửa kính và tắt hệ thống thông gió/điều hòa lấy khí ngoài.</li>
    </ul>

    <h3>III. ĐỘI HÌNH BỐ TRÍ CÁC ĐIỂM / LỰC LƯỢNG ỨNG PHÓ DÃ CHIẾN</h3>
    <table>
      <thead>
        <tr>
          <th style="width: 20%;">Vị trí / Trạm tác chiến</th>
          <th style="width: 20%;">Tọa độ &amp; Hướng chiến thuật</th>
          <th style="width: 25%;">Lực lượng &amp; Phương tiện</th>
          <th style="width: 35%;">Nhiệm vụ trọng tâm</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Sở chỉ huy tác chiến</strong></td>
          <td>Phía đầu gió an toàn (${cpBearing}°)<br>Khoảng cách: ~${(isoRadius * 1.3).toFixed(0)}m</td>
          <td>Ban Chỉ huy Binh chủng Hóa học<br>Xe thông tin tác chiến</td>
          <td>Chỉ đạo chiến dịch, điều phối trinh sát, tiếp nhận báo cáo và ra lệnh cứu hộ.</td>
        </tr>
        <tr>
          <td><strong>Trạm tiêu độc cơ động</strong></td>
          <td>Ranh giới cách ly theo hướng sơ tán 1 (${evac1}°)</td>
          <td>Đội tiêu tẩy chuyên trách<br>Xe tiêu tẩy ARS-14</td>
          <td>Phun sương màn nước dập hơi độc, tiêu độc cho người và phương tiện thoát khỏi vùng nhiễm.</td>
        </tr>
        <tr>
          <td><strong>Trạm cấp cứu y tế dã chiến</strong></td>
          <td>Ranh giới cách ly theo hướng sơ tán 2 (${evac2}°)</td>
          <td>Tổ Quân y Binh chủng &amp; Cấp cứu 115<br>Xe cứu thương chuyên dùng</td>
          <td>Cấp cứu ngộ độc khí, hỗ trợ hô hấp oxy áp lực cao, phân loại và chuyển viện tuyến trên.</td>
        </tr>
        <tr>
          <td><strong>Chốt phong tỏa hiện trường</strong></td>
          <td>Các trục đường dẫn vào vùng cách ly (${cpBearing}°)</td>
          <td>Lực lượng Vệ binh &amp; An ninh phối hợp<br>Rào chắn, cọc tiêu</td>
          <td>Dựng rào phong tỏa, cắm biển cảnh báo chất độc, điều tiết giao thông vòng tránh hiện trường.</td>
        </tr>
      </tbody>
    </table>

    <h3>IV. TRANG BỊ PHÒNG HỘ CÁ NHÂN (PPE) &amp; CHẤT TIÊU ĐỘC TRUNG HÒA</h3>
    <ul>
      <li><strong>Lực lượng trực tiếp tiếp cận nguồn độc:</strong> Bắt buộc trang bị PPE Cấp độ A (Quần áo phòng hóa kín khí tuyệt đối + Bình thở dưỡng khí độc lập SCBA).</li>
      <li><strong>Lực lượng tại các trạm vòng ngoài:</strong> Trang bị PPE Cấp độ B/C (Mặt nạ phòng hóa quân sự có phin lọc độc chuyên dụng + Bộ đồ phòng hóa toàn thân).</li>
      <li><strong>Biện pháp tiêu độc trung hòa:</strong> Triển khai xe chuyên dụng tạo màn sương nước áp lực cao hướng đón gió để hấp phụ mây khí độc; dùng vôi tôi Ca(OH)₂ hoặc dung dịch trung hòa thích hợp rải bao vây khu vực tràn đổ.</li>
    </ul>

    <h3>V. QUY TRÌNH HÀNH ĐỘNG THEO GIAI ĐOẠN</h3>
    <ul>
      <li><strong>Giai đoạn 1 (0 - 15 phút):</strong> Phát lệnh báo động khẩn cấp; triển khai Chốt phong tỏa và thiết lập Vành đai cách ly ${isoRadius}m; di chuyển Sở chỉ huy về đầu hướng gió.</li>
      <li><strong>Giai đoạn 2 (15 - 45 phút):</strong> Phát loa hướng dẫn dân cư sơ tán theo hướng ${evac1}° và ${evac2}°; Trạm y tế và Trạm tiêu độc đi vào vận hành tiếp nhận nạn nhân; xe ARS-14 phun sương dập mây độc.</li>
      <li><strong>Giai đoạn 3 (45 phút trở đi):</strong> Lực lượng trinh sát mang SCBA tiếp cận cô lập, bịt rò rỉ; tiêu độc triệt để mặt đất và nguồn nước; đánh giá nồng độ an toàn trước khi dỡ phong tỏa.</li>
    </ul>

    <table class="sign-table">
      <tr>
        <td style="width: 50%;">
          <strong>TRỰC BAN TÁC CHIẾN</strong><br>
          <em>(Ký, ghi rõ họ tên)</em><br><br><br><br>
          <strong>Cán bộ Tác chiến Phòng hóa</strong>
        </td>
        <td style="width: 50%;">
          <strong>CHỈ HUY TRƯỞNG PHÊ DUYỆT</strong><br>
          <em>(Ký tên, đóng dấu)</em><br><br><br><br>
          <strong>Chỉ huy trưởng</strong>
        </td>
      </tr>
    </table>
  `;
}

// Matches pmbc_web's exportResponsePlanDocx() document wrapper
// (mophongphattan.component.ts:3406-3488) — the classic "HTML saved with a
// .doc extension" trick: Word's legacy HTML import filter opens this fine,
// no real OOXML/.docx binary format (or a doc-generation library) needed.
export function buildResponsePlanDocHtml(result: SimulationResult): string {
  const body = generateResponsePlanBody(result);
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Phương án ứng phó sự cố khẩn cấp</title>
  <style>
    @page { size: A4; margin: 20mm 20mm 20mm 20mm; }
    body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.35; color: #000; }
    table { width: 100%; border-collapse: collapse; margin-top: 10pt; margin-bottom: 12pt; }
    th, td { border: 1px solid #333; padding: 6pt 8pt; font-size: 11pt; text-align: left; }
    th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
    .header-table { border: none; margin-bottom: 16pt; }
    .header-table td { border: none; padding: 2pt 4pt; vertical-align: top; }
    .title-box { text-align: center; margin: 18pt 0 16pt 0; }
    .main-title { font-size: 15pt; font-weight: bold; text-transform: uppercase; }
    .sub-title { font-size: 12pt; font-style: italic; }
    h3 { font-size: 13pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; text-transform: uppercase; }
    p, li { font-size: 12pt; margin: 4pt 0; text-align: justify; }
    .sign-table { border: none; margin-top: 24pt; }
    .sign-table td { border: none; text-align: center; font-size: 12pt; padding: 4pt; }
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

// Matches web's fileName (mophongphattan.component.ts:3491-3493).
export function buildResponsePlanFileName(result: SimulationResult): string {
  const chemName = (result.chem.name || 'hoachat').replace(/[^a-zA-Z0-9]/g, '_');
  const nowStr = new Date().toISOString().slice(0, 10);
  return `Phuong_an_ung_pho_su_co_${chemName}_${nowStr}.doc`;
}
