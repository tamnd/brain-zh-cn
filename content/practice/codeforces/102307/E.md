---
title: "CF 102307E - 极端图像"
description: "我们有 (n) 个发光体，每个发光体都通过其距地球的距离及其绕地球的角位置来描述。 天文台可以选择任意长度为 (d) 的径向间隔，写为 ([x,x+d])，以及任意长度为 (alpha) 的角度间隔，写为 ([omega,omega+alpha])。"
date: "2026-08-13T23:41:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "E"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 80
verified: true
draft: false
---

[CF 102307E - 极端图像](https://codeforces.com/problemset/problem/102307/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (n) 个发光体，每个发光体都通过其距地球的距离及其绕地球的角位置来描述。 天文台可以选择任意长度为 (d) 的径向间隔，写为 ([x,x+d])，以及任意长度为 (\alpha) 的角间隔，写为 ([\omega,\omega+\alpha])。 角坐标是圆形的，因此一个区间可以穿过 (360^\circ) 并从 (0^\circ) 继续。 

任务是选择两个区间，使得距离和角度同时位于其中的物体数量尽可能多。 答案是捕获尸体的最大数量。 

输入最多包含 (10^5) 个物体，距离最多为 (10^5) 个整数，所有角度和 (\alpha) 最多有小数点后两位数字。 (10^5) 界限排除了检查每对物体的可能性，因为 (O(n^2)) 算法在最坏的情况下将执行大约 (10^{10}) 次操作。 (O(n\log n)) 周围的解决方案适合两秒的限制。 

角度的两位小数为我们提供了另一个有用的界限。 将每个角度乘以 (100) 后，每个相关角度都是从 (0) 到 (35999) 的整数。 这让我们可以仅在 (36000) 个可能的角度位置上使用线段树，而不是构建大小取决于 (n) 的结构。 

第一个边界情况是（α=0）。 例如，```
1 10 0.00
5 20.00
```答案为 (1)，因为零长度的角区间仍然可以精确地包含处于其选定角度的物体。 将零长度视为空间隔的实现将错误地返回 (0)。 

第二个边界情况是角度间隔交叉 (360^\circ)。 例如，```
2 10 20.00
5 350.00
5 10.00
```有答案（2）。 选择角度间隔 ([350^\circ,10^\circ]) 捕获两个物体。 线性、非循环间隔实现会错过其中之一。 

第三个边界情况是包容性。 例如，```
2 10 10.00
1 0.00
11 10.00
```答案为 (2)，因为两个距离端点和两个角度端点都包含在内。 诸如 (r > x) 或 (\theta < \omega+\alpha) 之类的严格比较会丢失正好位于端点上的物体。 

最后，重复的位置必须全部计算在内。 例如，```
3 5 0.00
10 25.00
10 25.00
10 25.00
```有答案（3）。 即使它们的坐标相同，这些主体也是不同的，因此数据结构必须对每个输入主体执行一次更新。 

## 方法

 直接的方法是枚举每个可能的径向间隔和每个可能的角度间隔。 我们可以通过观察可以移动最佳径向间隔直到其右端点达到某个物体的距离来稍微减少第一部分，因此只有（n）个相关的径向窗口。 然而，对于每个这样的窗口，检查所有可能的角度起点或所有角度端点对仍然需要 (O(n)) 工作。 在最坏的情况下，这会变成 (O(n^2))，大约为 (n=10^5) 的 (10^{10}) 身体级操作，这远远超出了时间限制。 

蛮力是正确的，因为每个捕获的集合都是由一个径向间隔和一个角度间隔定义的，并且尝试所有相关选择最终会检查出最优对。 问题在于，每次径向变化后，角度问题都会从头开始重新计算。 

关键的观察是径向间隔可以被扫过。 按距离对物体进行排序，并精确维护距离属于当前窗口（[r-d,r]）的物体，其中（r）是当前最右边物体的距离。 当我们移动到下一个物体时，有些物体进入窗口，有些则离开窗口。 每个主体插入一次并移除一次。 

我们还需要回答一个动态角度问题：在当前活动的物体中，长度为（α）的角度区间内包含的最大数量是多少？ 

由于每个输入角度都有两位小数，因此将角度缩放 (100)。 仅有（36000）个可能的百度位置。 不要直接存储每个可能的间隔开始时的身体数量，而是考虑一个身体的贡献。 

假设物体有角度（θ）。 从 (s) 开始的角度间隔恰好捕获它

 [
 s \leq \theta \leq s+\alpha
 ]

 在圆圈上。 重新排列给出

 [
 \theta-\alpha \leq s \leq \theta。 
]

 因此，从可能的区间起始点的角度来看，一个物体对从 (\theta-\alpha) 到 (\theta) 的起始点的圆形范围贡献 (+1)。 因此，添加主体是循环范围加法，移除主体是循环范围减法。 

线段树可以支持范围加法和整个数组的最大值（O(\log 36000)）。 它的根始终存储当前活动径向窗口的最佳角度间隔。 将此与距离扫描相结合给出 (O(n\log n+n\log 36000)) 算法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | (O(n\log n+n\log 36000)) | (O(n+36000)) | 已接受 |

 ## 算法演练

1. 将每个角度和 (\alpha) 乘以 (100)，将输入转换为精确整数。 这避免了在边界处进行浮点比较，例如 (10.00) 与 (10.01)。 
2. 按距离对所有物体进行排序。 我们将以距离递增的顺序处理它们，并使用当前主体的距离作为活动径向窗口的右端点。 
3. 构建一棵具有（36000）个叶子的线段树。 Leaf (s) 表示选择以缩放角度 (s) 开始的角度间隔。 最初，每片叶子都包含零，因为没有物体处于活动状态。 
4. 当具有缩放角度 (\theta) 的物体变为活动状态时，将 (1) 添加到圆形区间 ([\theta-\alpha,\theta]) 中所有可能的起点。 每次这样的开始都会捕获该实体，因此精确增加这些值会更新每个受影响的角度间隔的捕获计数。 
5. 如果更新间隔过零，则将其分为两个普通范围，一个以 (35999) 结束，一个以零开始。 如果它不跨越零，一次普通的范围更新就足够了。 
6. 插入当前物体后，删除所有距离小于(r-d)的物体，其中(r)是当前物体的距离。 严格的不等式是故意的，因为径向间隔是封闭的，因此恰好位于 (r-d) 的物体必须保持活动状态。 
7. 读取存储在线段树根部的最大值并更新全局答案。 根代表当前径向窗口的所有起点中的最佳角度间隔。 
8. 继续遍历所有机构。 每个最佳径向间隔都可以移动，直到其右端点到达其捕获物体之一的距离，因此这些扫描位置之一代表最佳径向选择。 

### 为什么它有效

 在每个扫描位置，活动集恰好是距离位于闭区间 ([r-d,r]) 内的物体的集合。 对于这个固定的径向集，存储在线段树叶子(s)处的值正是其角度位于圆区间([s,s+α])内的活动体的数量。 这是事实，因为每个活动体都会精确地向捕获它的起始点贡献一个范围更新。 因此，线段树根是任何角度间隔捕获的活动体的最大数量。 

考虑一对最佳的径向间隔和角间隔。 如果最佳径向间隔至少包含一个物体，则将其向右移动，直到其右端点到达最远捕获物体的距离。 在此移动过程中不会丢失捕获的主体，因此有一个同样好的解决方案，其右端点是处理的距离之一。 在该扫描位置，线段树考虑每个可能的角度起点，因此找到一个角度间隔，准确捕获该径向选择的最大可能数量。 因此，该算法检查的解决方案至少与全局最优值一样好，而计算值不能超过某些有效间隔对捕获的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

ANGLE_COUNT = 36000
INF = 10**30

def parse_scaled(s):
    if '.' in s:
        whole, frac = s.split('.')
        frac = (frac + '00')[:2]
    else:
        whole, frac = s, '00'
    return int(whole) * 100 + int(frac)

class SegmentTree:
    def __init__(self, n):
        size = 1
        while size < n:
            size <<= 1
        self.size = size
        self.mx = [0] * (2 * size)
        self.lazy = [0] * (2 * size)

    def _apply(self, node, value):
        self.mx[node] += value
        self.lazy[node] += value

    def _push(self, node):
        value = self.lazy[node]
        if value:
            self._apply(node * 2, value)
            self._apply(node * 2 + 1, value)
            self.lazy[node] = 0

    def _add(self, node, left, right, ql, qr, value):
        if ql <= left and right <= qr:
            self._apply(node, value)
            return

        self._push(node)
        mid = (left + right) // 2

        if ql <= mid:
            self._add(node * 2, left, mid, ql, qr, value)
        if qr > mid:
            self._add(node * 2 + 1, mid + 1, right, ql, qr, value)

        self.mx[node] = max(self.mx[node * 2], self.mx[node * 2 + 1])

    def add(self, left, right, value):
        if left > right:
            return
        self._add(1, 0, self.size - 1, left, right, value)

    def maximum(self):
        return self.mx[1]

def solve():
    n, d, alpha_text = input().split()
    n = int(n)
    d = int(d)
    alpha = parse_scaled(alpha_text)

    points = []

    for _ in range(n):
        r_text, angle_text = input().split()
        r = int(r_text)
        angle = parse_scaled(angle_text)
        points.append((r, angle))

    points.sort()

    seg = SegmentTree(ANGLE_COUNT)

    def update_angle(theta, delta):
        if alpha == 0:
            seg.add(theta, theta, delta)
            return

        left = theta - alpha

        while left < 0:
            left += ANGLE_COUNT

        if left <= theta:
            seg.add(left, theta, delta)
        else:
            seg.add(left, ANGLE_COUNT - 1, delta)
            seg.add(0, theta, delta)

    left = 0
    answer = 0

    for right in range(n):
        r, theta = points[right]

        update_angle(theta, 1)

        while points[left][0] < r - d:
            old_theta = points[left][1]
            update_angle(old_theta, -1)
            left += 1

        answer = max(answer, seg.maximum())

    print(answer)

if __name__ == "__main__":
    solve()
```第一个解析细节是经过深思熟虑的。 Python 浮点值不应用于角度比较，因为十进制值如`0.01`通常不能精确地用二进制浮点数表示。 由于输入最多有两位小数，因此乘以 (100) 会得到精确的整数表示。 

这`points`数组按距离排序，这使得扫描具有一维结构。 指针`left`始终标记仍在当前径向窗口内的第一个实体。 

功能`update_angle`实现一个物体对可能的角度起始的贡献。 对于倾斜的身体`theta`，有效起始范围为`theta - alpha`通过`theta`。 当这个范围围绕零时，它由两个线段树更新表示。 

特殊情况`alpha == 0`值得拥有自己的分支。 那么有效的开始就是`theta`，因此更新必须影响一个叶子，而不是意外地创建一个大的包裹间隔。 

去除条件为`points[left][0] < r - d`。 身体恰好在`r-d`属于闭径向区间，不能去除。 由于两个端点都已更新，因此角度范围更新中已内置了相同的包容性解释。 

线段树为每个节点存储一个惰性值。 范围更新会以相同的量更改整个节点的最大值，因此可以应用它而无需下降到每个叶子。 因此，根在每次插入和删除后给出最佳的角度间隔。 

Python 中不存在整数溢出问题。 在固定宽度语言中，最大计数仅为 (10^5)，因此 32 位有符号整数已经足以存储计数。 

## 工作示例

 语句源列出了以下示例，其输出为 (3)。```
7 80 60.00
220 20.00
360 45.00
180 45.00
200 150.00
200 75.00
180 315.00
360 225.00
```缩放角度后，(α=6000)。 距离窗口的宽度为 (80)。 扫描状态可以总结如下。 

| 当前距离 | 有效距离| 当前最佳角数| 全球答案|
 | --- | --- | --- | --- |
 | 180 | 180 180, 180 | 2 | 2 |
 | 200 | 200 180, 180, 200, 200 | 180, 180, 200, 200 | 2 | 2 |
 | 220 | 220 180、180、200、200、220 | 3 | 3 |
 | 360 | 360 360 | 360 1 | 3 |

 在距离 (220) 处，活动径向区间为 ([140,220])，因此它包含距离 (180) 处的两个实体，两个实体均位于 (200) 处，以及实体位于 (220) 处。 线段树找到包含其中三个的宽度为 (60^\circ) 的角区间，给出最终答案 (3)。 

对于第二个示例，同时考虑径向边界和角包络。```
4 10 20.00
5 350.00
15 10.00
15 20.00
16 5.00
```扫描的行为如下。 

| 当前距离 | 按角度划分的活动物体 | 最佳角度启动| 最佳计数 |
 | --- | --- | --- | --- |
 | 5 | 350 | 350 350 | 350 1 |
 | 15 | 15 350、10、20 | 350 | 350 2 |
 | 16 | 16 10、20、5 | 350 | 350 3 |

 在距离 (15) 处，径向间隔为 ([5,15])，因此距离 (5) 处的主体保持活动状态，因为边界是包容性的。 从 (350^\circ) 开始的角度间隔覆盖 (350^\circ)、(10^\circ) 和 (10^\circ) 侧位置，直至 (10^\circ)，但不包括 (20^\circ)，因此最佳计数为 (2)。 在距离 (16) 处，距离 (5) 处的物体被移除，因为 (5 < 16-10)，留下距离 (15,15,16) 处的三个物体。 相同的圆角间隔可以捕获所有三个，因为 (350^\circ)、(5^\circ) 和 (10^\circ) 适合 (20^\circ) 包裹间隔内。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n+n\log 36000)) | 排序成本 (O(n\log n))，并且使用 (O(\log 36000)) 范围更新插入和删除每个主体一次。 |
 | 空间| (O(n+36000)) | 排序体需要 (O(n)) 空间，线段树需要 (O(36000)) 空间。 |

 由于 (36000) 由两位小数角度精度固定，因此线段树部分实际上是具有较小对数常数的 (O(n))。 主要操作是对 (10^5) 个实体进行排序，这很容易满足规定的约束。 

## 测试用例

 原始语句的显示示例输出是 (3)。```python
import sys
import io

ANGLE_COUNT = 36000

def parse_scaled(s):
    if '.' in s:
        whole, frac = s.split('.')
        frac = (frac + '00')[:2]
    else:
        whole, frac = s, '00'
    return int(whole) * 100 + int(frac)

class SegmentTree:
    def __init__(self, n):
        size = 1
        while size < n:
            size <<= 1
        self.size = size
        self.mx = [0] * (2 * size)
        self.lazy = [0] * (2 * size)

    def _apply(self, node, value):
        self.mx[node] += value
        self.lazy[node] += value

    def _push(self, node):
        value = self.lazy[node]
        if value:
            self._apply(node * 2, value)
            self._apply(node * 2 + 1, value)
            self.lazy[node] = 0

    def _add(self, node, left, right, ql, qr, value):
        if ql <= left and right <= qr:
            self._apply(node, value)
            return

        self._push(node)
        mid = (left + right) // 2

        if ql <= mid:
            self._add(node * 2, left, mid, ql, qr, value)
        if qr > mid:
            self._add(node * 2 + 1, mid + 1, right, ql, qr, value)

        self.mx[node] = max(self.mx[node * 2], self.mx[node * 2 + 1])

    def add(self, left, right, value):
        if left <= right:
            self._add(1, 0, self.size - 1, left, right, value)

    def maximum(self):
        return self.mx[1]

def solve():
    input = sys.stdin.readline

    n, d, alpha_text = input().split()
    n = int(n)
    d = int(d)
    alpha = parse_scaled(alpha_text)

    points = []
    for _ in range(n):
        r_text, angle_text = input().split()
        points.append((int(r_text), parse_scaled(angle_text)))

    points.sort()

    seg = SegmentTree(ANGLE_COUNT)

    def update(theta, delta):
        if alpha == 0:
            seg.add(theta, theta, delta)
            return

        left = theta - alpha
        if left < 0:
            left += ANGLE_COUNT

        if left <= theta:
            seg.add(left, theta, delta)
        else:
            seg.add(left, ANGLE_COUNT - 1, delta)
            seg.add(0, theta, delta)

    left = 0
    answer = 0

    for right in range(n):
        r, theta = points[right]
        update(theta, 1)

        while points[left][0] < r - d:
            update(points[left][1], -1)
            left += 1

        answer = max(answer, seg.maximum())

    return str(answer)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solve().strip()
    finally:
        sys.stdin = old_stdin

sample1 = """\
7 80 60.00
220 20.00
360 45.00
180 45.00
200 150.00
200 75.00
180 315.00
360 225.00
"""

assert run(sample1) == "3", "sample 1"

assert run("""\
1 1 0.00
1 0.00
""") == "1", "minimum-size case"

assert run("""\
3 5 0.00
10 25.00
10 25.00
10 25.00
""") == "3", "zero angular width and duplicates"

assert run("""\
2 10 20.00
5 350.00
5 10.00
""") == "2", "angular interval wraps around 360 degrees"

assert run("""\
2 10 10.00
1 0.00
11 10.00
""") == "2", "both radial and angular boundaries are inclusive"

# Maximum-size stress case. All bodies are at the same position,
# so the answer must be n.
n = 100000
large = [f"{n} 100000 359.99\n"]
large.extend(f"1 0.00\n" for _ in range(n))
assert run("".join(large)) == str(n), "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 0.00 / 1 0.00`| 1 | 最小输入尺寸和零角宽度 |
 | 三个相同的身体`alpha = 0`| 3 | 复制主体和精确的角度匹配 |
 | 尸体位于`350.00`和`10.00`和`alpha = 20.00`| 2 | 圆角间隔|
 | 距离`1`和`11`和`d = 10`| 2 | 包含径向和角度边界 |
 | 100000个相同的尸体`alpha = 359.99`| 100000 | 最大输入大小和大线段树计数 |

 ## 边缘情况

 对于零角宽度，考虑```
1 1 0.00
1 0.00
```缩放后的角宽度为零。 当唯一的身体被插入时，`update`准确地改变表示 (0^\circ) 的叶子。 线段树最大值变为 (1)，因此算法返回 (1)。 不会意外创建正长度的间隔。 

对于圆形包裹，请考虑```
2 10 20.00
5 350.00
5 10.00
```对于第一个主体，有效区间开始于 (330^\circ) 到 (350^\circ)。 对于第二个物体，它们的范围从 (350^\circ) 到 (10^\circ)，它与零交叉。 更新分为范围 ([350^\circ,359.99^\circ]) 和 ([0^\circ,10^\circ])。 因此，从 (350^\circ) 处开始会收到两个贡献，最大值为 (2)。 

对于包含距离边界，请考虑```
2 10 10.00
1 0.00
11 10.00
```当当前右距离为(11)时，径向窗口为([1,11])。 移除条件检查距离是否严格小于 (1)，因此距离 (1) 处的主体保持活动状态。 两个实体也可以位于角区间的端点上，因此线段树对两者进行计数并返回 (2)。 

对于重复的主体，请考虑```
3 5 0.00
10 25.00
10 25.00
10 25.00
```每个输入行都会导致单独的范围更新，即使所有三个更新都针对同一叶子。 叶子值变为（3），代表该坐标处的三个不同的发光体。 结果是(3)。 

相同的逻辑处理（α=359.99）。 除了宽度的微小互补角区间 (0.01^\circ) 之外，物体对所有可能的开始都有贡献。 由于线段树明确表示所有 (36000) 个百度起点，因此在此极值处不存在近似值或浮点模糊性。
