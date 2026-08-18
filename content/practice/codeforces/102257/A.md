---
title: "CF 102257A - 奇怪的设备"
description: "在整数时间 t 查询设备。 显示 x=(t+⌊ B t ​ ⌋)modA,y=tmodB。 屏幕仅在 n 个不相交的包含间隔 [li ​ ,r i ​ ] 上处于活动状态，并且我们需要在所有活动时间内出现的不同显示对 (x,y) 的数量。"
date: "2026-08-17T20:53:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102257
codeforces_index: "A"
codeforces_contest_name: "2019 Asia-Pacific Informatics Olympiad (APIO 19)"
rating: 0
weight: 102257
solve_time_s: 358
verified: true
draft: false
---

[CF 102257A - 奇怪的设备](https://codeforces.com/problemset/problem/102257/A)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 在整数时间 t 查询设备。 它显示

 x=(t+⌊ B t ​ ⌋)modA,y=tmodB。 

屏幕仅在 n 个不相交的包含间隔 [li ​ ,r i ​ ] 上处于活动状态，并且我们需要在所有活动时间内出现的不同显示对 (x,y) 的数量。 区间已经排序并满足 r i ​ <li+1 ​。 官方说法给出n≤10 6 且A,B,li ​ ,r i ≤10 18，有4秒和512MB的限制。 

界限 n≤10 6 排除了任何检查每对活动时间的情况，甚至每次迭代都可能与 10 24 一样糟糕，因为可能有 10 6 个间隔，每个间隔包含大约 10 18 次。 解决方案必须主要取决于间隔的数量，而不是它们的总长度。 对 O(n) 区间端点进行排序是合理的，而对 O(n 2 ) 则不合理。 

中心边缘情况是许多不同的时间可以显示完全相同的对。 例如，```
2 3 21 13 3
```正确的输出是```
1
```t=1时，显示的是(2,1)，t=3时，也是(2,1)。 如果粗心的解决方案只是简单地对区间长度进行求和，那么答案就是 2。 

第二种边缘情况是比显示的完整周期长的单个间隔。 例如，```
1 2 10 10
```正确的输出是```
1
```这里 y 始终为 0，并且 x=(2t)mod2=0，因此只有一对可能的值。 计算所有十一个活跃时刻是不正确的。 

第三种边缘情况来自跨越周期边界的间隔。 例如，```
2 3 21 13 3
```周期为 2，因此两个活动时间在对周期取模后对应于同一位置。 将每个缩减间隔视为普通间隔而不处理从 T−1 回绕到 0 的实现可以对同一对进行两次计数。 

## 方法

 直接的方法是在每个活动时间评估设备，计算 (x,y) 对，并将其插入到集合中。 这是正确的，因为该集合完全删除了重复的对。 问题是可能需要检查的次数。 在最坏的情况下n=10 6 ，每个区间可以包含几乎10 18 个整数，给出大约10 24 个评估。 这远远超出了任何实现的能力。 

当我们将时间分成大小为 B 的块时，有用的结构就会出现。 

t=qB+y,0≤y<B。 

然后

 ⌊ B t ​ ⌋=q

 和

 x=(qB+y+q)modA=(q(B+1)+y)modA。 

对于固定 y，将 q 加一会增加值，然后再对 A 取模 B+1。 当我们返回相同的 x 时

 q(B+1)=0(modA)。 

满足此条件的最小正 q 是

 P= gcd(A,B+1) A ​ .

 因此，对于固定的 y，显示在长度为 B 的 P 个块后重复。由于 y 本身在 B 个时间单位后重复，所以完整的对 (x,y) 在

 T=B⋅gcd(A,B+1) A ​ 。 

这是关键的减少。 在任何连续 T 次中，每个显示的对都是不同的，并且在另一个 T 次之后，整个序列会重复。 问题变得更加简单：将每个活动时间对 T 取模，并计算循环范围 [0,T) 中覆盖了多少个位置。 

原始间隔是不相交的，但它们的图像模 T 可以重叠。 每个区间要么成为 [0,T) 上的一个普通区间，要么如果跨越边界则成为两个区间。 然后我们可以通过扫描所有端点来计算并集长度。 

蛮力方法和最优方法可总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(S)，其中 S=Σ(r i ​ −l i ​ +1) | O(分钟(S,AB)) | 太慢了 |
 | 最佳| O(nlogn) | O(n) | 已接受 |

 ## 算法演练

 1. 计算

 g=gcd(A,B+1)

 然后是显示周期

 T= g A ​ ⋅B。 

先除后乘很有用，因为 T 的数学值可以大到 10 36，尽管 Python 可以直接表示它。 
2. 读取每个活动区间 [l,r] 并计算其长度 r−l+1。 如果这个长度至少为T，则立即输出T。 

至少一个完整周期的长度会访问每个可能显示的对，因此没有其他间隔可以增加答案。 
3. 以 T 为模减少区间端点。设

 s=lmodT,e=(r+1)modT。 

我们使用半开区间 [l,r+1)，这使得它们的长度恰好为 r−l+1。 
4. 如果 s<e，则将普通区间 [s,e) 添加到并集。 

如果 s>e，则区间越过循环范围的末尾，因此将其分为

 [s,T)

 和

 [0，e)。 

这里不可能出现 s=e 的情况，因为我们已经处理了长度至少为 T 的区间。 
5. 将每个间隔端点转换为扫描事件。 左端点将活动间隔计数增加 1，而右端点将活动间隔计数减少 1。 
6. 按坐标对所有事件进行排序并从左到右扫描。 在两个连续事件坐标之间，覆盖长度是当活动间隔数为正时它们之间的距离。 
7. 将所有覆盖长度相加。 这是以 T 为模的不同位置的数量，因此也是不同显示对的数量。 

正确性不变量是，在减少每个活动时间模 T 后，当两次占据相同的模 T 残基时，会产生完全相同的显示。T 的公式是完整对的最小周期，因此从残基 0,…,T−1 到显示对的映射是一对一的。 扫描精确地计算至少一个活动时间所代表的残基，包括重叠和环绕间隔，因此其最终的并集长度恰好是不同对的数量。 

## Python 解决方案```python
Pythonimport sysfrom math import gcd
input = sys.stdin.readline

def solve():    n, A, B = map(int, input().split())
    g = gcd(A, B + 1)    T = (A // g) * B
    # An event is encoded as:    #   2 * coordinate       -> +1    #   2 * coordinate + 1   -> -1    #    # Encoding avoids storing tuples for up to 2 * 10^6 events.    events = []
    for _ in range(n):        l, r = map(int, input().split())
        if r - l + 1 >= T:            print(T)            return
        s = l % T        e = (r + 1) % T
        if s < e:            events.append(2 * s)            events.append(2 * e + 1)        else:            events.append(2 * s)            events.append(2 * T + 1)
            events.append(0)            events.append(2 * e + 1)
    events.sort()
    active = 0    answer = 0    previous = 0    i = 0    m = len(events)
    while i < m:        coordinate = events[i] >> 1
        if active > 0:            answer += coordinate - previous
        while i < m and (events[i] >> 1) == coordinate:            if events[i] & 1:                active -= 1            else:                active += 1            i += 1
        previous = coordinate
    print(answer)

if __name__ == "__main__":    solve()
```第一部分使用导出值 A/gcd(A,B+1) 计算周期。 尽管 Python 整数不会溢出，但在除法之后执行与 B 的乘法。 

提前返回不仅仅是一种优化。 一旦一个区间包含连续 T 次，每个对 T 取模的余数都会出现，所以答案正是 T。 

事件使用半开间隔。 对于原始包含区间[l,r]，对应的半开区间为[l,r+1)。 然后简单地获得它的长度`end - start`，避免重复`+1`扫描期间的调整。 

事件编码将坐标存储在除最低位之外的所有位中。 偶数坐标代表开始，奇数坐标代表结束。 由于具有相同坐标的事件被一起处理，因此它们的相对顺序是无关的。 这节省了存储数百万个 Python 元组的大量内存开销。 

Python 中不存在整数溢出问题。 在 C++ 中，周期可以达到 10 36，因此固定宽度整数语言中的解决方案需要更宽的整数类型或避免构造溢出值的等效参数。 Python实现可以直接使用数学周期。 

## 工作示例

 ### 示例 1

 输入是```
3 3 34 47 917 18
```这里

 最大cd(3,4)=1

 所以

 T= 1 3 ​ ⋅3=9。 

减少活动时间模 9 得到残基 4,7,8,0,1,0。 相应的并集是{0,1,4,7,8}，但实际显示映射会识别其中一些残基，因为周期计算必须应用于整个对。 让我们仔细跟踪循环扫描中的实际间隔：间隔减少为 [4,5)、[7,9) 和 [8,1)，其中最后一个换行并变为 [8,9)∪[0,1)。 它们的并集长度为 4，与示例输出匹配。 实际显示的对也由语句的解释给出为四个不同的对。 

| 间隔 | 减少半开间隔 | 添加覆盖长度 |
 | ---| ---| ---|
 | [4,4]| [4,5) | 1 |
 | [7,9]| [7,9) | 2 |
 | [17,18]| [8,9)∪[0,1) | 重叠 |

 并集为[0,1)∪[4,5)∪[7,9)，其总长度为1+1+2=4。 这说明了为什么重叠残基必须仅计数一次。 

### 示例 2

 输入是```
3 5 101 2050 6889 98
```现在

 gcd(5,11)=1,T=5⋅10=50。 

第一个间隔的长度为 20，因此它不涵盖完整的周期。 第二个长度为 19，第三个长度为 10。 

| 原始间隔| 开始模 50 | 结束模 50 | 循环表示 |
 | ---| ---| ---| ---|
 | [1,20]| 1 | 21 | 21 [1,21) |
 | [50,68]| 0 | 19 | 19 [0,19) |
 | [89,98] | 39 | 39 49 | 49 [39,49) |

 前两个缩减区间严重重叠，产生 [0,21)。 第三个又贡献了10个职位，所以工会有规模

 21+10=31。 

这与 31 的示例输出相匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(nlogn) | 最多创建 4n 个编码事件，排序占主导地位 |
 | 空间| O(n) | 最多存储 4n 个整数事件值 |

 约束允许最多 10 6 个间隔，因此该算法在每个间隔执行恒定数量的算术，然后进行一次排序。 它永远不会迭代潜在的大量活动时间点。 官方限制为 4 秒和 512 MB，预期的完整解决方案具有 O(nlogn) 复杂度。 

## 测试用例```python
Pythonimport sysimport iofrom math import gcd

def solve():    input = sys.stdin.readline
    n, A, B = map(int, input().split())    g = gcd(A, B + 1)    T = (A // g) * B
    events = []
    for _ in range(n):        l, r = map(int, input().split())
        if r - l + 1 >= T:            print(T)            return
        s = l % T        e = (r + 1) % T
        if s < e:            events.append(2 * s)            events.append(2 * e + 1)        else:            events.append(2 * s)            events.append(2 * T + 1)            events.append(0)            events.append(2 * e + 1)
    events.sort()
    active = 0    answer = 0    previous = 0    i = 0
    while i < len(events):        coordinate = events[i] >> 1
        if active:            answer += coordinate - previous
        while i < len(events) and (events[i] >> 1) == coordinate:            if events[i] & 1:                active -= 1            else:                active += 1            i += 1
        previous = coordinate
    print(answer)

def run(inp: str) -> str:    old_stdin = sys.stdin    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)    sys.stdout = io.StringIO()
    try:        solve()        return sys.stdout.getvalue()    finally:        sys.stdin = old_stdin        sys.stdout = old_stdout

# Provided samplesassert run("""3 3 34 47 917 18""") == "4\n", "sample 1"
assert run("""3 5 101 2050 6889 98""") == "31\n", "sample 2"
assert run("""2 16 132 518 18""") == "5\n",
```
