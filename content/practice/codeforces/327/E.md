---
title: "CF 327E - 轴行走"
description: "我们有 n 个正的线段长度。 它们的总和是 d，这也是数轴上的终点。 路线只是这些长度的排序。 在遵循路线时，我们会保留一个运行的前缀和。"
date: "2026-06-06T08:58:49+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "combinatorics", "constructive-algorithms", "dp", "meet-in-the-middle"]
categories: ["algorithms"]
codeforces_contest: 327
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 191 (Div. 2)"
rating: 2300
weight: 327
solve_time_s: 145
verified: true
draft: false
---

[CF 327E - 轴行走](https://codeforces.com/problemset/problem/327/E)

 **评分：** 2300
 **标签：** 位掩码、组合学、构造性算法、dp、中间相遇
 **求解时间：** 2m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`正段长度。 他们的总和是`d`，这也是数轴上的目标点。 

路线只是这些长度的排序。 在遵循路线时，我们会保留一个运行的前缀和。 走完第一段后，我们停下来一次，走完第二段后，我们再次停下来，依此类推。 终点站总是在位置`d`。 

有些职位是不吉利的。 如果一条路线没有一个停靠点与不幸的位置重合，那么该路线就是好的。 

任务是计算给定长度有多少种排列是好的，模数`10^9 + 7`。 

最重要的观察是每个停止点都是排列的某些前缀的总和。 由于所有长度都是正数，因此前缀和严格递增。 这种单调性使得问题变得容易处理。 

约束条件`n ≤ 24`立即排除任何涉及所有排列的事情。 甚至`20!`是一个天文数字。 解决方案必须使用子集而不是排列。 

倒霉位置最多有两个。 这个微小的界限是第二个关键线索。 它建议对不幸的位置进行包含排除，只留下一些计数子问题。 

有几个容易被忽略的极端情况。 

如果一个不幸的位置不能被表示为子集和，那么任何路线都不能在那里停留。 例如：```
n = 3
a = [2, 4, 8]
unlucky = 5
```没有子集总和为`5`，所以每个排列都是有效的。 

如果不幸的位置等于总和`d`，每条路线都是无效的，因为终点站总是在`d`。 例如：```
n = 2
a = [3, 7]
unlucky = 10
```答案是`0`。 

当有两个不幸的位置时，一条路线可能会同时命中两个位置。 包含-排除必须将这些路由添加回来一次。 例如：```
a = [1, 2, 3]
unlucky = {1, 3}
```排列`[1,2,3]`击中两个不幸的位置，因此单独减去每个坏的集合将把它删除两次。 

## 方法

 暴力解决方案生成所有`n!`排列，计算所有前缀和，并检查是否有任何前缀不幸运。 

这是正确的，因为它直接遵循路由的定义。 不幸的是，它几乎立即变得无用。 即使是为了`n = 15`，排列数量超过`10^12`。 

为了获得可行的结果，我们需要间接计算排列。 

考虑一个不幸的位置`x`。 

一条路线到达`x`恰好当放置在该停止点之前的元素形成一个子集，其总和为`x`。 

假设一个子集`S`有总和`x`和尺寸`s`。 每个排列的所有元素`S`出现在所有外部元素之前`S`将达到`x`。 里面的元素`S`可以任意排序，其余元素也可以任意排序。 

因此该子集贡献```
s! · (n - s)!
```不好的排列。 

那么问题就变成了：```
For every subset whose sum is x,
add size! · remaining_size!
```这是子集和计数问题，而不是排列问题。 

自从`n ≤ 24`，中间相遇是自然的工具。 将数组最多分成两半大小`12`减少`2^24`子集到大约`2 · 2^12 = 8192`枚举。 

对于两个不幸的位置`x < y`，包含-排除需要计算同时到达两个位置的路线。 

这样的路线包含：```
S          -> prefix sum x
S ∪ U      -> prefix sum y
```在哪里```
sum(S) = x
sum(U) = y - x
S and U are disjoint
```如果```
|S| = a
|U| = b
```那么对应的排列是```
a! · b! · (n - a - b)!
```因为所有元素`S`必须首先出现，然后是所有元素`U`，然后是其他一切。 

现在每个元素都有三种可能的状态：```
belongs to S
belongs to U
belongs to neither
```这导致了三元中间相遇`3^(n/2)`州。 

为了`n = 24`, 每一半最多有`3^12 = 531441`状态，这是完全可以管理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·n!) | O(n·n!) | O(n) | 太慢了 |
 | 最佳 | O(2^(n/2) + 3^(n/2)) | O(3^(n/2)) | O(3^(n/2)) | 已接受 |

 ## 算法演练

 ### 计算到达一个不幸位置的路线

 1. 将数组分成两半。 
2. 枚举右半部分的每个子集并将它们分组`(sum, size)`。 
3. 枚举左半部分的每个子集。 
4. 对于目标不幸的位置`x`，假设左子集贡献`(sumL, sizeL)`。 我们需要有总和的右子集`x - sumL`。 
5. 每个匹配对形成一个完整子集，其总大小为`sizeL + sizeR`。 
6. 添加```
count · (sizeL + sizeR)! · (n - sizeL - sizeR)!
```到答案。 

这产生了命中的排列数`x`。 

### 计算到达两个不幸位置的路线

 假设`x < y`并让```
d = y - x
```1. 将数组分成两半。 
2. 枚举右半部分的所有三元赋值。 
3. 对于每个作业记录：```
(sumS, sumU, sizeS, sizeU)
```及其频率。 

1. 枚举左半部分的所有三元赋值。 
2. 对于左赋值，所需的右赋值必须满足：```
sumS_right = x - sumS_left
sumU_right = d - sumU_left
```1. 每个匹配对都确定一个不相交的对`(S,U)`。 
2. 如果组合尺寸为：```
a = sizeS_left + sizeS_right
b = sizeU_left + sizeU_right
```添加```
a! · b! · (n - a - b)!
```乘以匹配对的数量。 

### 包含-排除

 如果没有不幸的位置：```
answer = n!
```如果有一个不走运的位置：```
answer = n! - bad(x)
```如果有两个不幸的位置：```
answer = n! - bad(x) - bad(y) + bad_both(x,y)
```所有算术均以模进行`10^9 + 7`。 

### 为什么它有效

 对于单个不幸位置，到达该位置的每条路线恰好确定了停靠点之前出现的元素的一个子集。 相反，具有所需总和的每个子集都会准确生成`s!(n-s)!`这样的路线。 这在不良路由和计数子集配置之间建立了双射。 

对于两个不幸的位置，所有长度的正值保证必须首先到达较小的不幸位置。 因此，到达两个位置的每条路线都唯一地分解为不相交的集合`S`和`U`， 在哪里`S`到达第一个位置并且`S ∪ U`达到第二个。 计数公式直接来自排列内这些集合所需的块排序。 

由于包含-排除是精确的，因此每条路线都以正确的重数进行计数。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

MOD = 1000000007

def subset_bad(arr, target, fact):
    n = len(arr)
    m = n // 2
    left = arr[:m]
    right = arr[m:]

    right_map = defaultdict(lambda: [0] * (len(right) + 1))

    rlen = len(right)
    for mask in range(1 << rlen):
        s = 0
        cnt = 0
        for i in range(rlen):
            if mask >> i & 1:
                s += right[i]
                cnt += 1
        right_map[s][cnt] += 1

    ans = 0

    llen = len(left)
    for mask in range(1 << llen):
        s = 0
        cnt = 0
        for i in range(llen):
            if mask >> i & 1:
                s += left[i]
                cnt += 1

        need = target - s
        if need not in right_map:
            continue

        vec = right_map[need]

        for rsz, ways in enumerate(vec):
            if ways == 0:
                continue

            sz = cnt + rsz
            ans = (ans + ways * fact[sz] * fact[n - sz]) % MOD

    return ans

def both_bad(arr, x, y, fact):
    if x > y:
        x, y = y, x

    diff = y - x
    n = len(arr)

    m = n // 2
    left = arr[:m]
    right = arr[m:]

    right_map = defaultdict(lambda: defaultdict(int))

    def gen_half(values):
        res = []

        def dfs(idx, sum_s, sum_u, cnt_s, cnt_u):
            if idx == len(values):
                res.append((sum_s, sum_u, cnt_s, cnt_u))
                return

            v = values[idx]

            dfs(idx + 1, sum_s, sum_u, cnt_s, cnt_u)
            dfs(idx + 1, sum_s + v, sum_u, cnt_s + 1, cnt_u)
            dfs(idx + 1, sum_s, sum_u + v, cnt_s, cnt_u + 1)

        dfs(0, 0, 0, 0, 0)
        return res

    right_states = gen_half(right)

    for ss, su, cs, cu in right_states:
        right_map[(ss, su)][(cs, cu)] += 1

    ans = 0

    left_states = gen_half(left)

    for ss, su, cs, cu in left_states:
        need = (x - ss, diff - su)

        if need not in right_map:
            continue

        bucket = right_map[need]

        for (rs, ru), ways in bucket.items():
            a = cs + rs
            b = cu + ru
            c = n - a - b

            ans += ways * fact[a] * fact[b] * fact[c]
            ans %= MOD

    return ans

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    k = int(input())

    unlucky = []
    if k:
        unlucky = list(map(int, input().split()))

    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    total = fact[n]

    if k == 0:
        print(total)
        return

    if k == 1:
        ans = (total - subset_bad(a, unlucky[0], fact)) % MOD
        print(ans)
        return

    x, y = unlucky

    bad_x = subset_bad(a, x, fact)
    bad_y = subset_bad(a, y, fact)
    bad_both = both_bad(a, x, y, fact)

    ans = (total - bad_x - bad_y + bad_both) % MOD
    print(ans)

if __name__ == "__main__":
    solve()
```第一个助手计算命中单个不幸位置的排列数。 它执行标准的中间相遇子集和计数，但不是仅仅计算子集，而是通过以下方式对子集进行加权：`size!(n-size)!`。 

第二个助手计算包含-排除的交集项。 每个元素都分配给三个组之一：`S`,`U`，或两者都不是。 中间相遇结合了三元态，其总和完成了所需的目标。 

一个微妙的点是，权重仅取决于最终组的大小，而不取决于特定的元素。 这使得所有状态具有相同的`(sumS, sumU, sizeS, sizeU)`待汇总的信息。 

另一个细节是按排序顺序处理不幸的位置。 由于所有线段长度均为正，到达两个位置就意味着到达
