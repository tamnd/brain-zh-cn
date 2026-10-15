---
title: "CF 106123E - 恐龙践踏"
description: "我们有一个数组，其中每个值代表盘子上鸡星的数量。 在任何东西被破坏之前，Cole 可以精确地选择一个位置并将其值替换为 0。"
date: "2026-06-25T11:33:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106123
codeforces_index: "E"
codeforces_contest_name: "UTPC Contest 10-15-25 Div. 1 (Advanced)"
rating: 0
weight: 106123
solve_time_s: 47
verified: true
draft: false
---

[CF 106123E - 恐龙践踏](https://codeforces.com/problemset/problem/106123/E)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组，其中每个值代表盘子上鸡星的数量。 

在任何东西被破坏之前，科尔可以选择一个位置并将其值替换为`0`。 之后，巴尼选择一个长度为连续的子数组`k`并摧毁该段内的每个板块。 巴尼想要摧毁尽可能多的鸡星，而科尔则想让巴尼的最佳选择尽可能弱。 

任务是确定当两名玩家都采取最佳行动时巴尼最终消灭的鸡星数量。 

数组大小可以达到`10^5`，这立即排除了任何重新计算所有长度的解决方案 -`k`在 Cole 的每个可能选择之后子数组求和。 一个`O(n^2)`算法将执行大约`10^10`最坏情况下的操作，远远超出极限。 

微妙之处在于科尔只改变了一个位置，但这个位置却影响了许多不同的长度——`k`视窗。 幼稚的实现通常会为每个候选位置一一更新窗口，这会变得太慢。 

考虑输入```
5 3
3 5 7 4 7
```length-3 窗口总和为：```
[15, 16, 18]
```如果 Cole 删除该值`7`在位置`3`，窗口总和变为：```
[8, 9, 11]
```巴尼摧毁了`11`。 

粗心的做法可能只关注当前最大的窗口并试图削弱它。 这还不够，因为在削弱一个窗口之后，另一个窗口可能会成为新的最大值。 

另一个边缘情况出现时`k = n`。```
4 4
1 10 4 8
```只有一个可能的窗口。 科尔应该删除最大值，`10`, 给予```
1 + 0 + 4 + 8 = 13
```答案是`13`。 

任何解决方案都必须正确处理以下事实：某些窗口受到科尔选择的影响，而其他窗口则保持不变。 

## 方法

 蛮力的想法很简单。 计算每个长度-`k`窗口总和。 那么对于每个位置`i`, 假装`a[i]`变为零，更新每个包含`i`，找到最大的结果窗口总和，并保留所有选择的最佳答案`i`。 

这是正确的，因为它直接模拟游戏。 问题是成本。 职位可能属于`O(k)`窗户，并且有`n`职位。 在最坏的情况下，这会变成`O(nk)`，即`O(n^2)`什么时候`k`很大。 

关键的观察是改变`a[i]`仅影响包含位置的窗口`i`。 

让`S[j]`是`j`第-个长度-`k`窗户。 

设置后`a[i] = 0`:```
windows containing i:  S[j] - a[i]
other windows:         S[j]
```对于固定位置`i`，Barney 的最佳选择是以下选项中的最大值：```
1. The largest unaffected window.
2. The largest affected window after subtracting a[i].
```所以我们有效地需要两个值。 

可以使用窗口总和上的前缀和后缀最大数组来获得最大的不受影响的窗口。 

受影响最大的窗口就是：```
max_window_sum_in_containing_range - a[i]
```这成为窗口和数组上的范围最大查询。 

由于窗口总和永远不会改变，我们可以对它们进行一次预处理并回答每个范围最大查询`O(1)`使用稀疏表。 

这将整个问题简化为`O(n log n)`预处理和`O(n)`评估。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nk) | O(nk) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n log n) | O(n log n) | 已接受 |

 ## 算法演练

 1. 计算所有长度-`k`使用滑动窗口进行窗口求和。 

设窗口数为`W = n - k + 1`。 
2. 在窗口总和上构建前缀最大数组。`pref[j]`存储窗口中最大的窗口总和`1..j`。 
3. 在窗口总和上构建后缀最大数组。`suff[j]`存储窗口中最大的窗口总和`j..W`。 
4. 构建一个稀疏表，用于对窗口总和进行范围最大查询。 

这使我们能够获得任意区间内的最大窗口总和`O(1)`时间。 
5. 对于每个位置`i`，确定哪些窗口包含它。 

一个窗口开始于`j`包含位置`i`确切的时间：```
j ≤ i ≤ j + k - 1
```因此：```
L = max(1, i - k + 1)
R = min(i, W)
```6. 计算最大的不受影响的窗口。 

所有未受影响的窗户均位于室外`[L, R]`。 

使用前缀和后缀最大值：```
outside = max(
    pref[L - 1] if L > 1,
    suff[R + 1] if R < W
)
```7. 计算最大的受影响窗口。 

查询里面最大窗口总和`[L, R]`并减去`a[i]`。```
inside = max_window_in_[L,R] - a[i]
```8. 科尔选择后巴尼所能实现的最佳破坏`i`是```
max(outside, inside)
```9. 取所有位置的最小值`i`。 

### 为什么它有效

 对于固定位置`i`，每个窗口都属于两个组之一。 

窗户包含`i`准确地输掉`a[i]`从他们的总和。 Windows 不包含`i`保持不变。 

Barney 选择最大的结果窗口，因此该位置的答案是最佳未受影响窗口和最佳受影响窗口之间的最大值。 该算法精确地计算这两个量。 

因为每一个可能的位置`i`经过检查，科尔选择产生最小此类值的位置，最终答案正是游戏的极小极大值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

w = n - k + 1

# window sums
S = [0] * w
cur = sum(a[:k])
S[0] = cur

for i in range(k, n):
    cur += a[i] - a[i - k]
    S[i - k + 1] = cur

# prefix max
pref = [0] * w
pref[0] = S[0]
for i in range(1, w):
    pref[i] = max(pref[i - 1], S[i])

# suffix max
suff = [0] * w
suff[-1] = S[-1]
for i in range(w - 2, -1, -1):
    suff[i] = max(suff[i + 1], S[i])

# sparse table for RMQ max
lg = [0] * (w + 1)
for i in range(2, w + 1):
    lg[i] = lg[i // 2] + 1

K = lg[w] + 1
st = [S[:]]

j = 1
while (1 << j) <= w:
    prev = st[j - 1]
    length = w - (1 << j) + 1
    row = [0] * length
    half = 1 << (j - 1)

    for i in range(length):
        row[i] = max(prev[i], prev[i + half])

    st.append(row)
    j += 1

def range_max(l, r):
    length = r - l + 1
    p = lg[length]
    return max(st[p][l], st[p][r - (1 << p) + 1])

INF = 10**30
answer = INF

for idx in range(n):
    L = max(0, idx - k + 1)
    R = min(idx, w - 1)

    outside = 0

    if L > 0:
        outside = max(outside, pref[L - 1])

    if R + 1 < w:
        outside = max(outside, suff[R + 1])

    inside = range_max(L, R) - a[idx]

    answer = min(answer, max(outside, inside))

print(answer)
```第一部分计算所有长度 -`k`使用标准滑动窗口以线性时间进行窗口求和。 

前缀和后缀数组允许我们获得任何区间之外的最大窗口，而无需再次扫描数组。 

稀疏表存储窗口和数组的范围最大值。 由于数组永远不会改变，因此稀疏表是理想的选择，因为它提供了`O(1)`预处理后的最大查询数。 

一个很容易被忽略的实现细节是位置和窗口索引之间的转换。 该代码使用从零开始的索引，因此包含窗口间隔变为：```
L = max(0, idx - k + 1)
R = min(idx, w - 1)
```另一个微妙之处是每个窗口都包含所选位置。 在这种情况下，没有不受影响的窗口。 变量`outside`遗迹`0`，这是正确的，因为所有数组值都是正数，并且每个实际窗口总和都是非负数。 

## 工作示例

 ### 示例 1

 输入：```
5 3
3 5 7 4 7
```窗口总和：```
[15, 16, 18]
```| 职位| 已删除值 | 包含Windows | 拆除前最大的内部空间| 拆除后的内部| 最大外部 | 结果 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 3 | [15]| 15 | 15 12 | 12 18 | 18 18 | 18
 | 2 | 5 | [15,16]| 16 | 16 11 | 11 18 | 18 18 | 18
 | 3 | 7 | [15,16,18] | 18 | 18 11 | 11 0 | 11 | 11
 | 4 | 4 | [16,18]| 18 | 18 14 | 14 15 | 15 15 | 15
 | 5 | 7 | [18]| 18 | 18 11 | 11 16 | 16 16 | 16

 最小结果是`11`。 

此示例显示了从许多窗口共享的位置删除一个值比从边界位置删除它更有效的情况。 

### 示例 2

 输入：```
4 4
1 10 4 8
```窗口总和：```
[23]
```| 职位| 已删除值 | 拆除后的内部| 最大外部 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 22 | 22 0 | 22 | 22
 | 2 | 10 | 10 13 | 0 | 13 |
 | 3 | 4 | 19 | 19 0 | 19 | 19
 | 4 | 8 | 15 | 15 0 | 15 | 15

 最小结果是`13`。 

这演示了仅存在一个窗口的特殊情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 窗口总和、前缀/后缀数组和稀疏表构造 |
 | 空间| O(n log n) | O(n log n) | 稀疏表存储 |

 和`n ≤ 100000`， 一个`O(n log n)`解决方案完全符合典型的竞争性编程限制。 预处理后，最大查询范围变为恒定时间，从而可以有效地评估每个位置。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    w = n - k + 1

    S = [0] * w
    cur = sum(a[:k])
    S[0] = cur

    for i in range(k, n):
        cur += a[i] - a[i - k]
        S[i - k + 1] = cur

    pref = [0] * w
    pref[0] = S[0]
    for i in range(1, w):
        pref[i] = max(pref[i - 1], S[i])

    suff = [0] * w
    suff[-1] = S[-1]
    for i in range(w - 2, -1, -1):
        suff[i] = max(suff[i + 1], S[i])

    lg = [0] * (w + 1)
    for i in range(2, w + 1):
        lg[i] = lg[i // 2] + 1

    K = lg[w] + 1
    st = [S[:]]

    j = 1
    while (1 << j) <= w:
        prev = st[j - 1]
        length = w - (1 << j) + 1
        row = [0] * length
        half = 1 << (j - 1)

        for i in range(length):
            row[i] = max(prev[i], prev[i + half])

        st.append(row)
        j += 1

    def rmq(l, r):
        length = r - l + 1
        p = lg[length]
        return max(st[p][l], st[p][r - (1 << p) + 1])

    ans = 10**30

    for idx in range(n):
        L = max(0, idx - k + 1)
        R = min(idx, w - 1)

        outside = 0

        if L > 0:
            outside = max(outside, pref[L - 1])

        if R + 1 < w:
            outside = max(outside, suff[R + 1])

        inside = rmq(L, R) - a[idx]

        ans = min(ans, max(outside, inside))

    return str(ans) + "\n"

# provided samples
assert run("5 3\n3 5 7 4 7\n") == "11\n", "sample 1"
assert run("4 4\n1 10 4 8\n") == "13\n", "sample 2"

# custom cases
assert run("1 1\n5\n") == "0\n", "single element"
assert run("5 1\n4 4 4 4 4\n") == "4\n", "k equals 1"
assert run("5 5\n7 7 7 7 7\n") == "28\n", "single window all equal"
assert run("3 2\n1 100 1\n") == "1\n", "boundary overlap"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 5`|`0`| 最小可能尺寸 |
 |`5 1 / 4 4 4 4 4`|`4`| 每个窗口的长度为 1 |
 |`5 5 / 7 7 7 7 7`|`28`| 覆盖整个阵列的单一窗口 |
 |`3 2 / 1 100 1`|`1`| 多个窗口共享位置 |

 ## 边缘情况

 考虑：```
1 1
5
```只有一块板和一扇窗户。 科尔将那个盘子设置为零。 唯一的窗口总和变为零，因此巴尼摧毁了零个鸡星。 该算法计算的一个窗口总和等于`5`，然后评估唯一的位置并获得`5 - 5 = 0`。 

考虑：```
4 4
1 10 4 8
```每个窗口都包含每个位置，因为只有一个窗口。 对于职位`2`，受影响的窗口最大值为`23 - 10 = 13`并且没有不受影响的窗户。 算法正确离开`outside = 0`并返回`13`。 

考虑：```
3 2
1 100 1
```窗口总和是`[101, 101]`。 删除中间值同时影响两个窗口，产生`[1, 1]`。 该算法识别包含窗口间隔覆盖所有窗口并计算：```
inside = 101 - 100 = 1
outside = 0
```给出正确答案`1`。 

这些案例验证了受影响窗口的区间计算、缺失的未受影响窗口的处理以及极小极大逻辑均正常运行。
