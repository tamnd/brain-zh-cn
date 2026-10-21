---
title: "CF 1132C - 粉刷栅栏"
description: "我们有一个有 n 个部分的栅栏，编号从 1 到 n。 每个画家覆盖一个连续的区间[li,ri]。 最初所有 q 个画家都可用，但我们被迫解雇其中两个并保留剩余的 q - 2。"
date: "2026-06-12T04:08:40+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 1132
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 61 (Rated for Div. 2)"
rating: 1700
weight: 1132
solve_time_s: 122
verified: true
draft: false
---

[CF 1132C - 绘制栅栏](https://codeforces.com/problemset/problem/1132/C)

 **评分：** 1700
 **标签：** 暴力破解
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个栅栏`n`部分编号自`1`到`n`。 每个画家覆盖一个连续的区间`[l_i, r_i]`。 原来都是`q`画家是可用的，但我们被迫解雇其中两个并保留其余的`q - 2`。 

如果至少有一名保留的油漆工覆盖了围栏部分，则该部分被油漆。 目标是选择删除哪两个画家，以使绘制部分的总数尽可能大。 

输入给出了栅栏的长度和每个画家绘制的间隔。 输出是在恰好移除两个油漆工后仍保留油漆的栅栏部分的最大数量。 

约束是驱动解决方案设计的首要因素。 两个都`n`和`q`至多是`5000`。 尝试每一对被删除的画家的蛮力方法已经需要大约$$\binom{5000}{2} \approx 12.5 \text{ million}$$对。 

这听起来很大但很容易管理。 如果我们重新计算每对栅栏的绘制，真正的问题就会出现。 甚至做事`O(n)`每对工作大约需要$$12.5 \cdot 10^6 \cdot 5000$$的操作，这是完全不可行的。 

问题的结构表明我们应该预先计算有关覆盖率的信息，然后在常数或对数时间内评估每个删除的对。 

一些边缘情况很容易被错误处理。 

考虑：```
5 3
1 5
1 5
1 5
```移除任何两个画家仍然留下一个画家覆盖整个栅栏，所以答案是`5`。 仅错误地计算唯一覆盖范围的解决方案会低估剩余的绘制部分。 

另一个重要案例是：```
5 3
1 2
2 3
3 4
```部分`2`由两位画家和部分覆盖`3`也是由两位画家绘制的。 删除不同的对会影响不同的重叠。 我们必须仔细区分只覆盖一次和恰好两次的部分。 

第三个微妙的情况是：```
5 3
1 1
3 3
5 5
```除去任意两名画家，仅留下一个已绘制的部分。 覆盖范围非常稀疏，因此区间逻辑必须正确处理间隙。 

## 方法

 最直接的想法就是把每一对可以去掉的画家都尝试一下。 

对于固定对`(i, j)`，我们可以标记剩余画家绘制的所有部分，并计算仍有多少栅栏部分被覆盖。 这是正确的，因为它从字面上模拟了问题的定义。 

困难在于成本。 有大约`12.5 million`最坏情况下的画家配对。 重新计算覆盖范围高达`5000`每对围栏部分需要数百亿次操作。 

关键的观察是我们不需要为每一对重建整个绘画配置。 重要的是在移除两名油漆工后有多少部分未油漆。 

首先，计算每个栅栏部分有多少油漆工覆盖它。 

让`cover[x]`就是那个计数。 

假设我们移除画家`i`和`j`。 

只有在两种情况下，一部分才会从最终的绘画中消失。 

如果`cover[x] = 1`，那么恰好有一位画家覆盖了该部分。 删除该画家会使该部分消失。 

如果`cover[x] = 2`，那么恰好有两个画家覆盖了该部分。 只有当这两个画家都被移除时，该部分才会消失。 

无论移除哪两个画家，覆盖至少三个的部分仍会被涂漆。 

这将问题转化为计算损失，而不是重新计算最终的绘画。 

让：`total`= 至少由一名画家最初绘制的部分数量。 

对于每一位画家来说`i`， 定义：`one[i]`= 恰好被画家覆盖一次的部分数量`i`。 

每当画家画画时，这些部分就会消失`i`被删除。 

对于每对`(i, j)`， 定义：`two[i][j]`= 恰好被画家覆盖两次的部分数量`i`和`j`。 

只有当两位画家都被移除时，这些部分才会消失。 

然后去掉画家之后`i`和`j`，剩余的绘制部分等于：$$total - one[i] - one[j] - two[i][j]$$现在任务变成了计算`one`和`two`高效。 

因为区间是连续的并且`n ≤ 5000`，我们可以处理每个栅栏位置。 对于覆盖范围恰好为 1 的位置，我们会确定负责的油漆工。 对于覆盖范围恰好为 2 的位置，我们确定负责的画家对。 

为了有效地查询间隔计数，我们在覆盖范围等于 1 的位置和覆盖范围等于 2 的位置上构建前缀和。 

然后，在几次前缀和查询之后，可以在恒定时间内评估每个画家对。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(q²·n) 或更糟 | O(n) | 太慢了|
 | 最佳 | O(nq + q²) | O(q²) | 已接受 |

 ## 算法演练

 1. 读取所有画家间隔。 
2. 在栅栏上构建差异数组并计算`cover[x]`，每个部分的画家数量。 
3. 计数`total`，栅栏截面的数量`cover[x] > 0`。 
4. 创建数组`cnt1[x]`在哪里`cnt1[x] = 1`如果`cover[x] = 1`， 否则`0`。 
5. 创建数组`cnt2[x]`在哪里`cnt2[x] = 1`如果`cover[x] = 2`， 否则`0`。 
6. 构建前缀和`cnt1`和`cnt2`。 

这些使我们能够计算有多少个覆盖恰好为 1 或恰好 2 的位置位于任何区间内。 
7. 对于每一位画家`i`, 计算`one[i]`。 

这等于画家内部的位置数`i`的总覆盖范围恰好为 1 的区间。 
8.对于每一对画家`(i, j)`，计算有多少个位置被两位画家恰好覆盖了两次。 

由于恰好覆盖两次且属于两位画家的位置必须位于其间隔的交集内，因此我们用`cover[x] = 2`那个十字路口里面。 
9. 每对`(i, j)`, 计算$$total - one[i] - one[j] - two[i][j]$$并保持最大值。 
10.输出最大值。 

### 为什么它有效

 只有移除覆盖栅栏部分的所有油漆工后，栅栏部分才会消失。 

当某个部分的覆盖率恰好为 1 时，删除其唯一的画家就足以删除该部分。 这些部分有助于`one[i]`。 

当一个区域正好覆盖两个时，必须同时移除两名负责的油漆工。 这些部分有助于`two[i][j]`。 

当一个部分的覆盖率至少为 3 时，仅删除两名画家永远无法消除所有覆盖率。 

每个消失的部分都恰好属于这些类别之一，并且没有部分被计算两次。 最后，$$one[i] + one[j] + two[i][j]$$正是删除画家后丢失的部分数`i`和`j`。 从最初绘制的计数中减去这个损失就可以得到正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, q = map(int, input().split())

    segs = []
    diff = [0] * (n + 3)

    for _ in range(q):
        l, r = map(int, input().split())
        segs.append((l, r))
        diff[l] += 1
        diff[r + 1] -= 1

    cover = [0] * (n + 1)
    cur = 0
    total = 0

    for x in range(1, n + 1):
        cur += diff[x]
        cover[x] = cur
        if cur > 0:
            total += 1

    one_pos = [0] * (n + 1)
    two_pos = [0] * (n + 1)

    for x in range(1, n + 1):
        if cover[x] == 1:
            one_pos[x] = 1
        elif cover[x] == 2:
            two_pos[x] = 1

    pref1 = [0] * (n + 1)
    pref2 = [0] * (n + 1)

    for x in range(1, n + 1):
        pref1[x] = pref1[x - 1] + one_pos[x]
        pref2[x] = pref2[x - 1] + two_pos[x]

    one = [0] * q

    for i, (l, r) in enumerate(segs):
        one[i] = pref1[r] - pref1[l - 1]

    ans = 0

    for i in range(q):
        l1, r1 = segs[i]

        for j in range(i + 1, q):
            l2, r2 = segs[j]

            left = max(l1, l2)
            right = min(r1, r2)

            both = 0
            if left <= right:
                both = pref2[right] - pref2[left - 1]

            remaining = total - one[i] - one[j] - both
            if remaining > ans:
                ans = remaining

    print(ans)

if __name__ == "__main__":
    main()
```第一阶段使用差异数组计算每个栅栏部分的覆盖计数。 这避免了单独标记每个间隔并给出所有覆盖计数`O(n + q)`时间。 

数组`one_pos`和`two_pos`确定覆盖范围恰好为 1 或恰好为 2 的位置。 然后，前缀和允许在恒定时间内进行间隔查询。 

价值`one[i]`通过查询painter内部的coverage-one位置个数得到`i`的间隔。 每当画家`i`被删除。 

对于一对画家来说，只有他们的时间间隔的交集才重要。 仅当它属于两个画家时，覆盖范围恰好为二的部分才会消失，这意味着它位于该交叉点。 查询交叉点中两个位置的覆盖数量给出`two[i][j]`。 

最常见的实施错误是忘记交集可能是空的。 在这种情况下`both`必须保持为零。 

另一个容易出现的差一错误来自前缀和查询。 使用```
pref[r] - pref[l - 1]
```需要索引自的数组`1`和有效的第零个前缀条目。 

## 工作示例

 ### 示例 1

 输入：```
7 5
1 4
4 5
5 6
6 7
3 5
```覆盖范围计数：

 | 职位| 覆盖范围|
 | --- | --- |
 | 1 | 1 |
 | 2 | 1 |
 | 3 | 2 |
 | 4 | 3 |
 | 5 | 3 |
 | 6 | 2 |
 | 7 | 1 |

 因此`total = 7`。 

独特封面计数：

 | 画家| 间隔 | 一[i] |
 | --- | --- | --- |
 | 1 | [1,4]| 2 |
 | 2 | [4,5]| 0 |
 | 3 | [5,6]| 0 |
 | 4 | [6,7]| 1 |
 | 5 | [3,5]| 0 |

 如果移除画家 2 和 3，它们的交集仅包含位置 5，但覆盖范围为 3，因此`both = 0`。 

剩余：

 | 已删除对 | 损失| 剩余|
 | --- | --- | --- |
 | (2,3) | 0 | 7 |
 | (1,4) | 3 | 4 |
 | (1,5) | 3 | 4 |

 最大值为`7`。 

这个例子表明，删除没有唯一关键部分的画家可以让整个栅栏被涂上颜色。 

### 示例 2

 输入：```
5 3
1 3
2 4
3 5
```覆盖范围计数：

 | 职位| 覆盖范围|
 | --- | --- |
 | 1 | 1 |
 | 2 | 2 |
 | 3 | 3 |
 | 4 | 2 |
 | 5 | 1 |`total = 5`。 

| 画家| 一[i] |
 | --- | --- |
 | 1 | 1 |
 | 2 | 0 |
 | 3 | 1 |

 一对`(1,2)`，交集是`[2,3]`。 

唯一位置`2`覆盖范围正好为两个。 

| 配对| 一[i] | 一[j] | 两者 | 剩余|
 | --- | --- | --- | --- | --- |
 | (1,2) | 1 | 0 | 1 | 3 |
 | (1,3) | 1 | 1 | 0 | 3 |
 | (2,3) | 0 | 1 | 1 | 3 |

 答案=`3`。 

该跟踪演示了如何仅向负责两个位置的特定油漆工对收取费用。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q²) | 覆盖率计算是线性的，配对评估检查所有画家对 |
 | 空间| O(n + q) | 覆盖数组、前缀和和区间存储 |

 和`q ≤ 5000`，主导项大致为$$\binom{5000}{2} \approx 12.5 \text{ million}$$结对评价。 每个评估仅执行一些算术运算和恒定时间前缀和查询，这完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n, q = map(int, input().split())

    segs = []
    diff = [0] * (n + 3)

    for _ in range(q):
        l, r = map(int, input().split())
        segs.append((l, r))
        diff[l] += 1
        diff[r + 1] -= 1

    cover = [0] * (n + 1)
    cur = 0
    total = 0

    for i in range(1, n + 1):
        cur += diff[i]
        cover[i] = cur
        if cur:
            total += 1

    one_pos = [0] * (n + 1)
    two_pos = [0] * (n + 1)

    for i in range(1, n + 1):
        if cover[i] == 1:
            one_pos[i] = 1
        elif cover[i] == 2:
            two_pos[i] = 1

    pref1 = [0] * (n + 1)
    pref2 = [0] * (n + 1)

    for i in range(1, n + 1):
        pref1[i] = pref1[i - 1] + one_pos[i]
        pref2[i] = pref2[i - 1] + two_pos[i]

    one = [0] * q
    for i, (l, r) in enumerate(segs):
        one[i] = pref1[r] - pref1[l - 1]

    ans = 0

    for i in range(q):
        l1, r1 = segs[i]
        for j in range(i + 1, q):
            l2, r2 = segs[j]

            L = max(l1, l2)
            R = min(r1, r2)

            both = 0
            if L <= R:
                both = pref2[R] - pref2[L - 1]

            ans = max(ans, total - one[i] - one[j] - both)

    print(ans)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.getvalue().strip()

# provided sample
assert run(
"""7 5
1 4
4 5
5 6
6 7
3 5
"""
) == "7", "sample 1"

# minimum sizes
assert run(
"""3 3
1 1
2 2
3 3
"""
) == "1", "minimum q"

# all intervals equal
assert run(
"""5 3
1 5
1 5
1 5
"""
) == "5", "all equal intervals"

# sparse intervals
assert run(
"""5 3
1 1
3 3
5 5
"""
) == "1", "disjoint painters"

# off-by-one boundary coverage
assert run(
"""5 3
1 2
2 3
3 5
"""
) == "3", "endpoint intersections"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三个单细胞画家| 1 | 最小有效尺寸 |
 | 所有间隔`[1,5]`| 5 | 到处都有严重重叠|
 | 三个不相交的区间 | 1 | 覆盖范围稀疏|
 | 端点接触间隔 | 3 | 正确的交叉口边界 |

 ## 边缘情况

 考虑：```
5 3
1 5
1 5
1 5
```覆盖范围是`3`在每个位置。 没有覆盖一或覆盖二的位置。 每一个`one[i]`等于`0`， 每一个`two[i][j]`等于`0`， 和$$5 - 0 - 0 - 0 = 5$$对于每一对。 算法正确返回`5`。 

现在考虑：```
5 3
1 1
3 3
5 5
```覆盖一位置正好是`{1,3,5}`。 每个画家都拥有一个这样的职位。 删除任何两个画家都会丢失两个已绘制的部分，只留下一个。 该算法计算：$$3 - 1 - 1 = 1$$并返回`1`。 

最后考虑：```
5 3
1 2
2 3
3 4
```覆盖计数为`[1,2,2,1,0]`。 职位`2`和`3`覆盖范围恰好为两个。 移除画家`1`和`2`失去位置`1`来自独特的覆盖范围和位置`2`来自双重覆盖。 该算法通过以下方式分别计算这些损失`one`和`both`，避免重复计算并产生正确的结果。
