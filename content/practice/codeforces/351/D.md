---
title: "CF 351D - Jeff 和删除句号"
description: "对于每个查询，我们查看给定数组的子数组并询问其美丽程度。 单个操作选择几个相等的值，其位置形成算术级数，将它们删除，然后允许我们对剩余的所有内容重新排序。 最后一句话是关键。"
date: "2026-06-06T22:08:08+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 351
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 204 (Div. 1)"
rating: 2700
weight: 351
solve_time_s: 159
verified: true
draft: false
---

[CF 351D - Jeff 和删除句号](https://codeforces.com/problemset/problem/351/D)

 **评分：** 2700
 **标签：** 数据结构
 **求解时间：** 2m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个查询，我们查看给定数组的子数组并询问其**美丽**。 

单个操作选择几个相等的值，其位置形成算术级数，将它们删除，然后允许我们对剩余的所有内容重新排序。 

最后一句话是关键。 第一次操作后，其余元素的顺序变得完全可控。 如果出现一个值$c$次，我们可以将所有$c$复制形成算术级数的位置，并在一次操作中删除它们。 从那时起，每个不同的值始终可以在一次操作中删除。 

唯一困难的部分是**first**操作，因为它必须使用查询子数组的原始顺序。 

数组长度和查询次数均达到$10^5$。 任何独立处理查询的解决方案都会立即被排除。 甚至$O(\sqrt n)$每个查询的工作量已经接近极限。 我们需要一个离线数据结构解决方案，大致如下$O((n+q)\sqrt n)$总的复杂性。 

当某个值在查询间隔内恰好出现一次时，就会出现微妙的边缘情况。```
[5, 7, 5]
```对于间隔$[2,2]$，值$7$出现一次。 单个位置本质上是一个算术级数，因此可以立即删除该值。 任何仅检查至少出现两次的值的解决方案都会错过这一点。 

另一个容易犯的错误是认为重新排序后我们可以以某种方式将不同的值组合到一个操作中。```
[1, 1, 2, 2]
```操作始终仅删除相等的值。 即使重新排序后，我们能做的最好的就是删除所有$1$一次操作即可完成所有操作$2$在另一个。 答案是$2$， 不是$1$。 

最重要的极端情况是每个值出现多次，但它们都没有形成算术级数。```
positions of 1: 1, 3, 6
positions of 2: 2, 5, 9
```两组位置都不是算术级数。 第一次操作不能完全消除任何值。 额外失败的第一次操作将答案增加了 1。 

## 方法

 蛮力观点出奇地有用。 

假设我们知道查询间隔内每个值的所有出现情况。 如果某个值在区间内出现的所有值都位于算术级数上，则该值可立即移除。 如果我们首先删除这样的值，那么在重新排序后，可以在一次操作中删除剩余的不同值。 

让$D$是区间内不同值的数量。 

如果某个值可以立即删除，我们花费一次操作删除它，然后$D-1$对剩余的不同值进行更多操作。 答案是$D$。 

如果没有可立即删除的值，则第一次操作只能删除某个值的一部分。 进行该操作后，所有$D$不同的价值观仍然存在。 然后需要重新排序$D$额外的操作。 答案是$D+1$。 

因此每个查询都会减少到两个数量：

 1. 不同值的数量。 
2. 是否存在至少一个值，其出现在区间内形成等差数列。 

这个观察就是整个问题。 它出现在许多公认的解决方案中，并且是标准 Mo 算法方法的基础。 

幼稚的实施仍然太慢。 对于每个查询，我们必须收集每个值的出现次数并从头开始测试算术级数条件。 在最坏的情况下变成$O(n)$或者每个查询更糟，这远远超出了$10^5$查询允许。 

在Mo的算法下，区间端点逐渐移动。 不同值的数量很容易维护。 真正的挑战是维护当前出现的算术级数的值的数量。 

公认的解决方案会预先计算辅助数组，这些数组可以准确地告诉我们何时添加或删除一个出现会导致某个值不再是算术级数，或者又开始成为一个。 那么每次Mo更新都会变成$O(1)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nq)$或者更糟|$O(n)$| 太慢了 |
 | 最佳（Mo + AP 维护）|$O((n+q)\sqrt n)$|$O(n)$| 已接受 |

 ## 算法演练

 ### 关键特征

 让$D$是当前间隔中不同值的数量。 

让$G$是在区间内出现的值形成算术级数的数量。 

如果$G>0$，答案是$D$。 

如果$G=0$，答案是$D+1$。 

所以整个任务就变成了维护$D$和$G$。 

### 预处理出现结构

 对于每个职位$i$：

 1. 计算`pre[i]`，上一次出现的相同值。 
2. 计算`bak[i]`，下一次出现相同的值。 

然后构建两个辅助数组。`fl[i]`存储最左边的位置，超出该位置的等值链结束于$i$不再是算术级数。`fr[i]`存储向右看时的对称信息。 

这些数组是通过连续出现相同值时动态重复计算的。 

### 莫订购

 1. 使用标准 Mo 排序对所有查询进行排序。 
2. 保持当前间隔$[L,R]$。 
3. 移动$L$和$R$匹配每个查询。 

### 保持独特的价值观

 1. 保留`cnt[value]`。 
2. 当频率从$0$到$1$， 增加$D$。 
3. 当频率从$1$到$0$， 减少$D$。 

### 维护算术级数值

 1. 保留$G$，当前出现的值形成算术级数的数量。 
2. 当边界移动时，仅插入或删除一个边界。 
3. 使用`fl`和`fr`，确定在$O(1)$该更新是否改变相应值的AP状态。 
4.增减$G$因此。 

预先计算的数组准确地告诉我们新出现的事件何时会产生第一个等间距违规，或者删除某个事件时会消除最后一个违规。 

### 回答查询

 1.调整好间隔后，我们知道$D$和$G$。 
2.如果$G>0$， 输出$D$。 
3.否则输出$D+1$。 

### 为什么它有效

 第一次操作后，允许任意重新排序。 然后可以对每个剩余的不同值进行排列，使其所有副本都位于算术级数上，并且可以在一次操作中删除。 

如果在任何重新排序发生之前存在可以完全删除的值，则查询间隔正好需要少一次操作。 该条件相当于说该值在区间内的出现形成了算术级数。 

因此，答案仅取决于不同值的数量以及至少一个值当前是否“良好”。 Mo 结构准确地维护了这两条信息，因此每个报告的答案都是正确的。 

## Python 解决方案```python
import sys
from math import isqrt

input = sys.stdin.readline

def solve():
    n = int(input())
    a = [0] + list(map(int, input().split()))

    maxv = 100000

    pre = [0] * (n + 1)
    bak = [0] * (n + 1)
    fl = [0] * (n + 1)
    fr = [0] * (n + 2)

    last = [0] * (maxv + 1)

    for i in range(1, n + 1):
        pre[i] = last[a[i]]
        last[a[i]] = i

        if pre[i] == 0 or pre[pre[i]] == 0:
            fl[i] = 0
        elif pre[pre[i]] - pre[i] == pre[i] - i:
            fl[i] = fl[pre[i]]
        else:
            fl[i] = pre[pre[i]]

    last = [0] * (maxv + 1)

    for i in range(n, 0, -1):
        bak[i] = last[a[i]]
        last[a[i]] = i

        if bak[i] == 0 or bak[bak[i]] == 0:
            fr[i] = n + 1
        elif bak[bak[i]] - bak[i] == bak[i] - i:
            fr[i] = fr[bak[i]]
        else:
            fr[i] = bak[bak[i]]

    q = int(input())
    block = isqrt(n) + 1

    queries = []
    for idx in range(q):
        l, r = map(int, input().split())
        queries.append((l, r, idx))

    queries.sort(key=lambda x: (x[0] // block, x[1]))

    cnt = [0] * (maxv + 1)
    ans = [0] * q

    distinct = 0
    good = 0

    def add_left(pos, cur_r):
        nonlocal distinct, good
        x = a[pos]

        cnt[x] += 1
        if cnt[x] == 1:
            distinct += 1
            good += 1
        elif fr[pos] <= cur_r and fr[bak[pos]] > cur_r:
            good -= 1

    def remove_left(pos, cur_r):
        nonlocal distinct, good
        x = a[pos]

        cnt[x] -= 1
        if cnt[x] == 0:
            distinct -= 1
            good -= 1
        elif fr[pos] <= cur_r and fr[bak[pos]] > cur_r:
            good += 1

    def add_right(pos, cur_l):
        nonlocal distinct, good
        x = a[pos]

        cnt[x] += 1
        if cnt[x] == 1:
            distinct += 1
            good += 1
        elif fl[pos] >= cur_l and fl[pre[pos]] < cur_l:
            good -= 1

    def remove_right(pos, cur_l):
        nonlocal distinct, good
        x = a[pos]

        cnt[x] -= 1
        if cnt[x] == 0:
            distinct -= 1
            good -= 1
        elif fl[pos] >= cur_l and fl[pre[pos]] < cur_l:
            good += 1

    L = 1
    R = 0

    for l, r, idx in queries:
        while L > l:
            L -= 1
            add_left(L, R)

        while R < r:
            R += 1
            add_right(R, L)

        while L < l:
            remove_left(L, R)
            L += 1

        while R > r:
            remove_right(R, L)
            R -= 1

        ans[idx] = distinct if good > 0 else distinct + 1

    sys.stdout.write("\n".join(map(str, ans)))

if __name__ == "__main__":
    solve()
```预处理阶段为每个值构建上一个和下一个出现的链接。 然后使用这些链接来计算`fl`和`fr`，对算术级数属性首次中断的位置进行编码。 

Mo结构保持滑动区间。 每次更新仅更改一个位置，因此只能更改一个值的状态。 辅助数组让我们能够在恒定时间内检测到这种变化。 

错误的一个常见来源是忘记更新函数必须使用**当前**间隔边界，而不是正在处理的查询边界。 另一个常见错误是在评估转换条件之前更新间隔端点。 

## 工作示例

 ### 示例 1

 输入间隔：```
[2, 2, 1, 1, 2]
```| 价值| 职位 |
 | --- | --- |
 | 1 | 3, 4 |
 | 2 | 1, 2, 5 |

 不同的价值观：

 | d | 良好的价值观|
 | --- | --- |
 | 2 | 值 1 |

 价值位置$1$是$(3,4)$，这是一个算术级数。 

由于存在良好的价值，答案是$D=2$。 

此示例演示了中心观察：可以立即删除一个值，然后在重新排序后删除剩余的值。 

### 自定义示例

 数组：```
[1, 2, 1, 2, 2, 1]
```询问：```
[1, 6]
```| 价值| 职位 |
 | --- | --- |
 | 1 | 1, 3, 6 |
 | 2 | 2、4、5 |

 检查等间距：

 | 价值| 差异| 美联社？ |
 | --- | --- | --- |
 | 1 | 2, 3 | 没有 |
 | 2 | 2, 1 | 没有 |

 这里$D=2$和$G=0$。 

回答：$$D + 1 = 3$$第一次操作无法完全消除任何值，因此额外的操作是不可避免的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+q)\sqrt n)$| 标准 Mo 算法$O(1)$更新 |
 | 空间|$O(n)$| 出现链接、辅助数组、频率、查询 |

 和$n,q \le 10^5$， 大致$O((n+q)\sqrt n)$操作完全符合时间限制，并且内存使用量仍远低于 256 MB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    from math import isqrt

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    input = sys.stdin.readline

    n = int(input())
    a = [0] + list(map(int, input().split()))

    maxv = 100000

    pre = [0] * (n + 1)
    bak = [0] * (n + 1)
    fl = [0] * (n + 1)
    fr = [0] * (n + 2)

    last = [0] * (maxv + 1)

    for i in range(1, n + 1):
        pre[i] = last[a[i]]
        last[a[i]] = i

        if pre[i] == 0 or pre[pre[i]] == 0:
            fl[i] = 0
        elif pre[pre[i]] - pre[i] == pre[i] - i:
            fl[i] = fl[pre[i]]
        else:
            fl[i] = pre[pre[i]]

    last = [0] * (maxv + 1)

    for i in range(n, 0, -1):
        bak[i] = last[a[i]]
        last[a[i]] = i

        if bak[i] == 0 or bak[bak[i]] == 0:
            fr[i] = n + 1
        elif bak[bak[i]] - bak[i] == bak[i] - i:
            fr[i] = fr[bak[i]]
        else:
            fr[i] = bak[bak[i]]

    q = int(input())
    block = isqrt(n) + 1

    qs = []
    for idx in range(q):
        l, r = map(int, input().split())
        qs.append((l, r, idx))

    qs.sort(key=lambda x: (x[0] // block, x[1]))

    cnt = [0] * (maxv + 1)
    res = [0] * q

    distinct = 0
    good = 0

    def add_left(pos, cur_r):
        nonlocal distinct, good
        x = a[pos]
        cnt[x] += 1
        if cnt[x] == 1:
            distinct += 1
            good += 1
        elif fr[pos] <= cur_r and fr[bak[pos]] > cur_r:
            good -= 1

    def remove_left(pos, cur_r):
        nonlocal distinct, good
        x = a[pos]
        cnt[x] -= 1
        if cnt[x] == 0:
            distinct -= 1
            good -= 1
        elif fr[pos] <= cur_r and fr[bak[pos]] > cur_r:
            good += 1

    def add_right(pos, cur_l):
        nonlocal distinct, good
        x = a[pos]
        cnt[x] += 1
        if cnt[x] == 1:
            distinct += 1
            good += 1
        elif fl[pos] >= cur_l and fl[pre[pos]] < cur_l:
            good -= 1

    def remove_right(pos, cur_l):
        nonlocal distinct, good
        x = a[pos]
        cnt[x] -= 1
        if cnt[x] == 0:
            distinct -= 1
            good -= 1
        elif fl[pos] >= cur_l and fl[pre[pos]] < cur_l:
            good += 1

    L, R = 1, 0

    for l, r, idx in qs:
        while L > l:
            L -= 1
            add_left(L, R)
        while R < r:
            R += 1
            add_right(R, L)
        while L < l:
            remove_left(L, R)
            L += 1
        while R > r:
            remove_right(R, L)
            R -= 1

        res[idx] = distinct if good > 0 else distinct + 1

    return "\n".join(map(str, res))

# sample 1
assert run(
"""5
2 2 1 1 2
5
1 5
1 1
2 2
1 3
2 3
"""
) == "2\n1\n1\n2\n2"

# minimum size
assert run(
"""1
7
1
1 1
"""
) == "1"

# all equal
assert run(
"""4
5 5 5 5
1
1 4
"""
) == "1"

# two distinct singletons
assert run(
"""2
1 2
1
1 2
"""
) == "2"

# AP positions present
assert run(
"""5
1 2 1 3 1
1
1 5
"""
) == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素| 1 | 尽可能最小的间隔 |
 | 所有相同的值 | 1 | 一次操作删除一个值 |
 | 两个不同的单身人士 | 2 | Singleton 值总是好的 |
 | 位置 1、3、5 具有相同的值 | 3 | 算术级数检测 |

 ## 边缘情况

 考虑：```
1
7
1
1 1
```该间隔包含一个出现一次的值。 单个位置是一个算术级数，所以$G=1$,$D=1$，答案是$1$。 

考虑：```
4
5 5 5 5
1
1 4
```所有出现的情况都属于一个值。 它们的位置形成等差数列，因此整个区间在一次运算中消失。 算法保持$D=1$和$G=1$，产生答案$1$。 

考虑：```
6
1 2 1 2 2 1
1
1 6
```价值$1$占据位置$1,3,6$, 差异$2,3$。 价值$2$占据位置$2,4,5$, 差异$2,1$。 没有价值就是好的。 算法结束于$D=2$和$G=0$，返回$3$，这符合最优策略。
