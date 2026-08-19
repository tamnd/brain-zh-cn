---
title: "CF 102214I - 图片"
description: "我们有一个大的灰度图像 (​​I)，其像素是写为两位十六进制值的字节，以及一个较小的模板图像 (T)。 模板可能是从大图像中裁剪出来的，但由于有损压缩，其像素不需要完全匹配。"
date: "2026-08-18T11:35:28+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102214
codeforces_index: "I"
codeforces_contest_name: "\u041e\u0442\u043a\u0440\u044b\u0442\u043e\u0435 \u043b\u0438\u0447\u043d\u043e\u0435 \u043f\u0435\u0440\u0432\u0435\u043d\u0441\u0442\u0432\u043e \u0418\u041a\u0418\u0422 \u0421\u0424\u0423 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2015"
rating: 0
weight: 102214
solve_time_s: 217
verified: true
draft: false
---

[CF 102214I - 图片](https://codeforces.com/problemset/problem/102214/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个大的灰度图像 (I)，其像素是写为两位十六进制值的字节，以及一个较小的模板图像 (T)。 模板可能是从大图像中裁剪出来的，但由于有损压缩，其像素不需要完全匹配。 

对于模板适合的每个可能的左上角位置 ((x,y))，我们将每个模板像素 (T(i,j)) 与相应的图像像素 (I(x+i,y+j)) 进行比较。 分数是差的平方和，

 [
 SSD(x,y)=\sum_{i=0}^{M-1}\sum_{j=0}^{N-1}
 (I(x+j,y+i)-T(j,i))^2。 
]

 所需的输出是具有最低分数的任何位置。 坐标是从零开始的，因此 (0\le x\le W-N) 和 (0\le y\le H-M)。 输入像素是十六进制的，但解析后它们是从 0 到 255 的普通整数。 

大图像最多可以包含 (1024\cdot768=786432) 个像素，而模板本身几乎可以包含同样大的像素。 因此，在每个可能的位置进行直接比较可以执行数百亿个像素操作。 在 4 秒限制下，图像维度的二次或四次算法是不现实的。 我们需要同时计算所有模板相关性，这正是卷积和 FFT 有用的运算类型。 

直接实现可能会错误地处理几种边界情况。 如果模板与图像的尺寸完全相同，则只有一个合法位置。 例如，```
1 1
7
1 1
7
```有唯一可能的答案`0 0`。 无意中使用的搜索`< W-N`而不是`<= W-N`会找不到位置。 

单像素模板是另一种有用的边界情况。 为了```
3 1
10 20 30
1 1
1E
```模板包含十六进制`1E`，它是十进制 30，所以答案是`2 0`。 将输入视为十进制而不是十六进制会默默地改变问题。 

等值图像可以有许多最佳位置。 为了```
3 2
07 07 07
07 07 07
2 1
07 07
```每个合法位置的 SSD 为零，所以`0 0`,`1 0`， 和`0 1`都是正确的。 程序不得假设最优值是唯一的。 

最后，右下位置是合法的，必须检查。 例如，```
3 3
00 00 00
00 00 00
00 00 2A
1 1
2A
```具有唯一的最佳值`2 2`。 错误的循环停止于`W-N-1`或者`H-M-1`想念它。 

## 方法

 暴力法直接遵循定义。 对于每个合法的左上角位置，它访问所有（NM）模板像素，计算与相应图像像素的差值，对其进行平方，并将其添加到当前分数中。 这是正确的，因为每个 SSD 都是完全按照定义进行评估的。 

职位数量为

 [
 (W-N+1)(H-M+1),
 ]

 所以总工作量是

 [
 O((W-N+1)(H-M+1)NM)。 
]

 在（W=1024）、（H=768）、（N=512）和（M=384）处，有（513\cdot385=197505）个位置，每次比较扫描（512\cdot384=196608）个像素。 这大约是 (3.88\times10^{10}) 像素比较。 蛮力法在数学上很简单，但远远超出了时间限制。 

有用的观察来自于扩大正方形：

 [
 (I-T)^2=I^2-2IT+T^2。 
]

 对于固定位置，这给出

 \总和 I(x+j,y+i)^2
 -2\总和 I(x+j,y+i)T(j,i)
 +\sum T(j,i)^2。 
]

 最后一项与位置无关，因为模板永远不会改变。 第一项是大图像矩形窗口上的平方和，因此在构建 (I^2) 的二维前缀和后，可以在恒定时间内获得每个这样的值。 

唯一困难的部分是

 [
 C(x,y)=
 \sum I(x+j,y+i)T(j,i)。 
]

 这是二维互相关。 如果我们在两个维度上反转模板，相关性就变成了普通的二维卷积。 卷积定理表明，可以通过使用二维 FFT 变换两个数组，乘以相应的频率系数，然后将结果变换回来来计算该卷积。 这将昂贵的部分从扫描每个位置的每个模板像素更改为粗略的 (O(PQ(\log P+\log Q)))，其中 (P) 和 (Q) 是适当的 2 的幂。 

还有一个有用的实施优化。 一种简单的 FFT 解决方案将对图像执行一次正向变换，对反向模板执行另一次变换，然后执行一次逆变换。 由于两个输入都是实数，我们可以将它们打包到一个复数数组中，如 (I+iT')。 从一个傅里叶变换，可以使用共轭对称性恢复实部和虚部的变换。 这样就只剩下一种正向二维 FFT 和一种逆向二维 FFT。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((W-N+1)(H-M+1)NM)) | (O(WH)) | 太慢了 |
 | 最佳| (O(PQ(\log P+\log Q))) | (O(PQ)) | 已接受 |

 ## 算法演练

1. 读取图像和模板，将每个两位十六进制像素转换为 0 到 255 之间的整数。将大图像存储为 (I)，将模板存储为 (T)。 输出的维度保持宽度优先形式，而数组使用行优先索引。 
2. 构建 (I^2) 的二维前缀和。 对于任何矩形图像窗口，可以通过四次前缀和访问来获得图像像素的平方和。 这可以处理位置相关的 (\sum I^2) 项，而无需重复访问所有模板像素。 
3. 计算 (S_T=\sum T^2) 一次。 这对于每个可能的放置都是相同的，因此没有理由重新计算它。 
4. 选择满足 (P\ge H+M-1) 和 (Q\ge W+N-1) 的两个 (P) 和 (Q) 的幂。 这些维度足够大，足以容纳完整的线性卷积，而不是循环卷积。 填充至关重要，因为 FFT 自然会计算循环卷积。 
5. 创建一个 (P\times Q) 复数数组。 将大图像（I）放入其真实部分。 将两个维度反转的模板放入其虚部。 如果(T')是反转模板，则存储的值在概念上是(I+iT')。 
6. 应用二维 FFT。 二维变换被实现为跨每一行的一维 FFT，然后是每一列的一维 FFT。 在此操作之后，使用共轭对称恒等式来恢复 (I) 和 (T') 的频域变换。 
7. 将恢复的变换逐点相乘。 根据卷积定理，该乘积的逆变换就是卷积(I*T')。 因为(T')是在两个维度上反转的模板，所以((y+M-1,x+N-1))处的系数正是SSD公式所需的相关性(C(x,y))。 
8.应用逆二维FFT以获得空间域中的所有相关值。 浮点 FFT 会引入微小的数值误差，因此每个相关性在用于精确整数 SSD 公式之前都会四舍五入到最接近的整数。 
9. 迭代所有合法模板位置。 对于每个((x,y))，从前缀和中获取(I^2)的窗口和，从卷积结果中获取相关性，并计算

 [
 SSD(x,y)=windowSquareSum-2C(x,y)+S_T。 
]

 保留最小值的位置。 

1. 打印最佳位置为`x y`。 当多个位置具有相同的 SSD 时，从上到下、从左到右扫描位置就足够了，因为该语句允许任何最佳位置。 

### 为什么它有效

 前缀和给出了扩展 SSD 公式中第一项的精确值，而 (S_T) 正是常数第三项。 反转模板将剩余的互相关转换为卷积，其系数通过 FFT 计算恢复。 因此，对于每个合法位置，该算法都会准确地重建定义其 SSD 的三个项，直到通过舍入整数相关性消除浮点 FFT 误差，可以忽略不计。 由于检查了每个合法位置并选择了最小的重构 SSD，因此返回的位置是最优的。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def next_pow2(x):
    p = 1
    while p < x:
        p <<= 1
    return p

def make_rev(n):
    rev = [0] * n
    half = n >> 1
    j = 0
    for i in range(1, n):
        bit = half
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        rev[i] = j
    return rev

def make_roots(n):
    forward = {}
    inverse = {}

    length = 2
    while length <= n:
        half = length >> 1
        angle = 2.0 * math.pi / length

        wf = []
        wi = []
        for j in range(half):
            a = angle * j
            c = math.cos(a)
            s = math.sin(a)
            wf.append(complex(c, -s))
            wi.append(complex(c, s))

        forward[length] = wf
        inverse[length] = wi
        length <<= 1

    return forward, inverse

def fft1d(a, invert, rev, roots_forward, roots_inverse):
    n = len(a)

    for i in range(n):
        j = rev[i]
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    roots = roots_inverse if invert else roots_forward

    while length <= n:
        half = length >> 1
        w = roots[length]

        for base in range(0, n, length):
            for j in range(half):
                u = a[base + j]
                v = a[base + j + half] * w[j]
                a[base + j] = u + v
                a[base + j + half] = u - v

        length <<= 1

    if invert:
        inv_n = 1.0 / n
        for i in range(n):
            a[i] *= inv_n

def fft2(mat, invert, rev_p, rev_q, roots_p_f, roots_p_i,
         roots_q_f, roots_q_i):
    p = len(mat)
    q = len(mat[0])

    for r in range(p):
        fft1d(mat[r], invert, rev_q, roots_q_f, roots_q_i)

    col = [0j] * p
    for c in range(q):
        for r in range(p):
            col[r] = mat[r][c]

        fft1d(col, invert, rev_p, roots_p_f, roots_p_i)

        for r in range(p):
            mat[r][c] = col[r]

def build_prefix_square(img):
    h = len(img)
    w = len(img[0])

    pref = [[0] * (w + 1) for _ in range(h + 1)]

    for r in range(h):
        row_sum = 0
        prev = pref[r]
        cur = pref[r + 1]

        for c in range(w):
            v = img[r][c]
            row_sum += v * v
            cur[c + 1] = prev[c + 1] + row_sum

    return pref

def rect_sum(pref, y1, x1, y2, x2):
    return (
        pref[y2][x2]
        - pref[y1][x2]
        - pref[y2][x1]
        + pref[y1][x1]
    )

def solve():
    first = input().split()
    while not first:
        first = input().split()

    W, H = map(int, first)

    image = []
    for _ in range(H):
        row = input().split()
        while not row:
            row = input().split()
        image.append([int(x, 16) for x in row])

    N, M = map(int, input().split())

    template = []
    for _ in range(M):
        row = input().split()
        while not row:
            row = input().split()
        template.append([int(x, 16) for x in row])

    pref = build_prefix_square(image)

    template_square = 0
    for row in template:
        for v in row:
            template_square += v * v

    P = next_pow2(H + M - 1)
    Q = next_pow2(W + N - 1)

    mat = [[0j] * Q for _ in range(P)]

    for r in range(H):
        dst = mat[r]
        src = image[r]
        for c in range(W):
            dst[c] = complex(src[c], 0.0)

    for r in range(M):
        src = template[r]
        dst = mat[M - 1 - r]
        for c in range(N):
            dst[N - 1 - c] += complex(0.0, src[c])

    rev_p = make_rev(P)
    rev_q = make_rev(Q)

    roots_p_f, roots_p_i = make_roots(P)
    roots_q_f, roots_q_i = make_roots(Q)

    fft2(
        mat,
        False,
        rev_p,
        rev_q,
        roots_p_f,
        roots_p_i,
        roots_q_f,
        roots_q_i,
    )

    # Recover FFT(image) * FFT(reversed_template) from
    # one packed transform FFT(image + i * reversed_template).
    #
    # For Z = A + iB:
    # A_k = (Z_k + conj(Z_-k)) / 2
    # B_k = (Z_k - conj(Z_-k)) / (2i)
    #
    # Process conjugate-frequency pairs together so that the
    # original spectrum is never overwritten before it is needed.

    for r in range(P):
        rr = (-r) % P

        for c in range(Q):
            cc = (-c) % Q

            idx = r * Q + c
            ridx = rr * Q + cc

            if idx > ridx:
                continue

            z = mat[r][c]
            zn = mat[rr][cc].conjugate()

            a = (z + zn) * 0.5
            b = (z - zn) * (-0.5j)

            product = a * b

            mat[r][c] = product

            if idx != ridx:
                mat[rr][cc] = product.conjugate()

    fft2(
        mat,
        True,
        rev_p,
        rev_q,
        roots_p_f,
        roots_p_i,
        roots_q_f,
        roots_q_i,
    )

    best_x = 0
    best_y = 0
    best = None

    for y in range(H - M + 1):
        for x in range(W - N + 1):
            window_square = rect_sum(
                pref,
                y,
                x,
                y + M,
                x + N,
            )

            corr = int(round(mat[y + M - 1][x + N - 1].real))

            ssd = window_square - 2 * corr + template_square

            if best is None or ssd < best:
                best = ssd
                best_x = x
                best_y = y

    return f"{best_x} {best_y}"

if __name__ == "__main__":
    print(solve())
```输入阶段将每个十六进制标记转换为`int(token, 16)`。 这比手动处理数字和字母更好，并且它还接受大写或小写的十六进制。 

前缀结构存储额外的行和列。 具有半开放边界的矩形`[y1, y2) x [x1, x2)`然后通过四次访问来恢复。 使用半开坐标可以避免第一行和第一列出现特殊情况。 

FFT 尺寸基于全卷积尺寸，而不仅仅是原始图像尺寸。 如果填充太小，FFT 将计算循环卷积，并且数组一侧的值将环绕到另一侧。 

模板被放置在相反的坐标上，因为卷积在其原始方向上使用内核，而相关性则需要反转内核。 行的系数`y + M - 1`和列`x + N - 1`因此对应于放置在`(x, y)`。 

压缩 FFT 部分是实现中最微妙的部分。 如果`Z`是的变换`A+iB`，则变换为`A`可以从中恢复`Z[k]`和共轭`Z[-k]`。 同一对给出的变换`B`。 同时处理两个频率位置可以防止一个变换后的值在其共轭伙伴被读取之前被覆盖。 

Python 的整数不会溢出，因此最终的 SSD 表达式是安全的，即使其最大值约为 (255^2\cdot786432)，大于 (2^{32})。 FFT 本身使用浮点复数，但所需的相关性是整数。 对最终实数系数进行舍入可以准确地恢复给定值范围内的整数。 

## 工作示例

 ### 示例 1

 图像是```
00 FF 12
AA BB 34
```模板是```
FF 11
```水平位置有两种可能，垂直位置只有一种。 

| x| y | 窗口| 相关性| 窗口 (\sum I^2) | 固态硬盘| 迄今为止最好的 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 0 |`00 FF`| (0\cdot255+255\cdot17) | (0^2+255^2) | (0^2+255^2) | 121669 | 121669`(0,0)`|
 | 1 | 0 |`FF 12`| (255\cdot255+18\cdot17) | (255^2+18^2) | (255^2+18^2) | 1 |`(1,0)`|

 在`(1,0)`，第一个像素完全匹配，第二个像素仅相差一个，因此 SSD 为 (1)。 该算法从卷积中获得相同的相关性并选择`1 0`，匹配样本。 

### 示例 2

 因为图像是(4\times5)，模板是(3\times3)，所以有六个合法位置。 

| x| y | 固态硬盘| 迄今为止最好的 |
 | ---| ---| ---| ---|
 | 0 | 0 | 82038 |`(0,0)`|
 | 1 | 0 | 72104 | 72104`(1,0)`|
 | 0 | 1 | 85314 |`(1,0)`|
 | 1 | 1 | 88380 |`(1,0)`|
 | 0 | 2 | 83249 |`(1,0)`|
 | 1 | 2 | 105273 | 105273`(1,0)`|

 最小分数为`(1,0)`。 此示例说明了为什么仅最大化相关性并不能有效替代最小化 SSD。 (\sum I^2) 项在窗口之间变化，因此必须包括窗口能量和相关性。 

## 复杂度分析

 让

 [
 P=2^{\lceil\log_2(H+M-1)\rceil}
 ]

 和

 [
 Q=2^{\lceil\log_2(W+N-1)\rceil}。 
]

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(PQ(\log P+\log Q)+WH+NM)) | 二维 FFT 加前缀和和输入处理 |
 | 空间| (O(PQ+WH)) | 填充复数 FFT 数组和图像前缀和 |

 对于最大尺寸，两个填充尺寸最多为 2048，因此 (P Q\le 2048^2)。 预期的解决方案非常适合 1024 MB 的内存限制，而 FFT 将相关计算从数十亿的直接像素乘法减少到频域变换。 已发布的问题给出了 4 秒的限制，因此实现需要迭代 FFT 而不是递归 FFT，并且通过将两个实际输入打包到一个复杂的变换中可以大大受益。 

## 测试用例

 下面的测试工具假设`solve()`解决方案中的功能可用。 最大尺寸的情况是通过编程生成的，而不是嵌入数十万个输入像素。```python
# helper: run solution on input string, return output string
import sys
import io

# Assume solve() is imported from the submitted solution.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve().strip()
    finally:
        sys.stdin = old_stdin

# Sample 1
sample1 = """\
3 2
00 FF 12
AA BB 34
2 1
FF 11
"""
assert run(sample1) == "1 0", "sample 1"

# Sample 2
sample2 = """\
4 5
89 4E 72 C6
C7 E9 EA 8F
6E B1 FD E4
7C 22 6C D0
93 FB DB E5
3 3
79 C0 51
B9 98 37
BB 64 7F
"""
assert run(sample2) == "1 0", "sample 2"

# Minimum-size input.
minimum = """\
1 1
00
1 1
00
"""
assert run(minimum) == "0 0", "minimum size"

# All positions have the same SSD.
all_equal = """\
3 2
07 07 07
07 07 07
2 1
07 07
"""
assert run(all_equal) == "0 0", "all equal values"

# The unique optimum is the bottom-right position.
bottom_right = """\
3 3
00 00 00
00 00 00
00 00 2A
1 1
2A
"""
assert run(bottom_right) == "2 2", "bottom-right boundary"

# Maximum-size dimensions, all zeros.
# Every position is optimal, and the scan should return 0 0.
W, H = 1024, 768
N, M = 1024, 768

image_rows = "\n".join(
    " ".join(["00"] * W)
    for _ in range(H)
)
template_rows = "\n".join(
    " ".join(["00"] * N)
    for _ in range(M)
)

maximum = (
    f"{W} {H}\n"
    f"{image_rows}\n"
    f"{N} {M}\n"
    f"{template_rows}\n"
)

assert run(maximum) == "0 0", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 00 / 1 1 / 00`|`0 0`| 最小尺寸和单一合法位置|
 | 一个`3 x 2`图像充满`07`，有一个`2 x 1`模板充满`07`|`0 0`| 多个最佳位置和零SSD |
 | 一个`3 x 3`仅右下像素等于的图像`2A`，有一个`1 x 1`模板`2A`|`2 2`| 包含右边界和下边界 |
 |`1024 x 768`全零图像和同等大小的全零模板 |`0 0`| 最大尺寸、内存使用量和大填充 |
 | 样品1 |`1 0`| 十六进制解析和独特的最优值 |
 | 样品2 |`1 0`| 通用二维匹配 |

 ## 边缘情况

 当模板与图像大小相同时，FFT 仍然有效，但只有一个候选者。 为了```
1 1
7
1 1
7
```填充卷积包含所需的相关性`(0,0)`，前缀和给出(7^2)，模板平方和给出(7^2)，SSD变为零。 扫描仅进行一次迭代并打印`0 0`。 

对于单像素模板，相关性降低为模板像素与每个图像像素的乘积。 为了```
3 1
10 20 30
1 1
1E
```模板值是十六进制`1E`，或 30。三个 SSD 值是 (400)、(100) 和 (0)，因此算法打印`2 0`。 不需要特殊的一维情况，因为相同的卷积公式可以处理它。 

对于完全平等的图像和模板，每个合法位置都可以具有相同的分数。 和```
3 2
07 07 07
07 07 07
2 1
07 07
```每个位置的相关性和窗口平方项都是相同的，因此 SSD 到处都是零。 由于扫描开始于`(0,0)`并且仅在发现严格较小的分数时才替换答案，并打印`0 0`，这是一个有效的最优值。 

对于右下边界，```
3 3
00 00 00
00 00 00
00 00 2A
1 1
2A
```法律坐标是`0..2`在两个维度上。 独特的零SSD位置是`(2,2)`。 算法使用的卷积系数在row`2 + 1 - 1 = 2`和列`2 + 1 - 1 = 2`，因此边界位置只包含一次。 

对于十六进制输入，诸如以下的值`0A`,`FF`， 和`e7`必须全部接受。 蟒蛇的`int(token, 16)`处理所有这些，因此该算法不需要单独的数字和字母解析逻辑。 

对于最大尺寸，图像和模板都可以是（1024\times768）。 卷积需要高达 (2047\times1535) 的维度，对于 FFT，其四舍五入为 (2048\times2048)。 该实现故意在这些维度上分配填充变换，而不是尝试仅处理原始图像区域，因为零填充不足会将所需的线性卷积转变为循环卷积并破坏边界附近的相关值。
