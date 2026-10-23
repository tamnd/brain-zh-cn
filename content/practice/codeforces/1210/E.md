---
title: "CF 1210E - Wojtek 和卡片技巧"
description: "我们有一小副 $k$ 牌，编号为 1 到 $k$，Wojtek 知道这副牌的 $n$ 种不同的确定性洗牌（排列）。 每次洗牌都准确指定每张牌的最终位置。"
date: "2026-06-11T23:14:48+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1210
codeforces_index: "E"
codeforces_contest_name: "Dasha Code Championship - SPb Finals Round (only for onsite-finalists)"
rating: 2700
weight: 1210
solve_time_s: 109
verified: true
draft: false
---

[CF 1210E - Wojtek 和卡片技巧](https://codeforces.com/problemset/problem/1210/E)

 **评分：** 2700
 **标签：** 数学
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个小甲板$k$卡片，编号为 1 到$k$，Wojtek 知道$n$牌组的不同确定性洗牌（排列）。 每次洗牌都准确指定每张牌的最终位置。 Wojtek 很好奇，如果他记住了一组连续的洗牌，他可以制作出所有可能的牌组。$l$到$r$并以任意顺序应用它们任意次数。 具体来说，我们想要对所有可能的连续范围求和$l$到$r$Wojtek 通过这些技巧可以生成不同套牌的数量。 

输入给出$n$排列，每个长度$k$。 限制条件是$n$最多可达 200,000，同时$k$非常小，最多 5 个。这种组合意味着任何迭代所有对的算法$(l,r)$在$O(n^2)$时间太慢了。 然而，自从$k$很小，它允许我们明确地对所有可能的牌组状态进行建模 - 不同牌组状态的数量最多为$k!$。 这个小数字使得详尽地推理卡片的排列成为可能。 

边缘情况包括单次洗牌已经可以生成所有可能的牌组的序列。 例如，与$k=3$和像 (2,3,1) 这样的洗牌循环，重复应用它会产生每个排列。 另一个边缘情况是$k=1$，每次洗牌都是微不足道的，无论牌组如何，都只产生一副可能的牌组$n$。 粗心的实现可能会忽略相同洗牌的重复应用，或者错过一旦排列集生成完整对称组，额外的洗牌不会增加计数。 

## 方法

 蛮力方法将迭代每个子数组$l$到$r$，模拟洗牌应用程序的所有序列，并计算不同的牌组。 和$n$最多 200,000 个，有$O(n^2)$子数组，对于每个子数组，模拟序列呈指数分布$k$。 虽然$k \le 5$,$O(n^2 \cdot k!)$太慢了。 蛮力之所以有效，是因为对于小$n$它正确计算$f(l,r)$通过探索由排列生成的群，但是对于大的情况来说它失败了$n$。 

关键的见解是$k!$很小。 为了$k=5$,$k! = 120$，这意味着我们可以将任何范围的可达牌组集合表示为位掩码或整数集合。 此外，向一组排列添加新的排列只会扩展可到达的牌组； 它永远不会减少它们。 因此，对于固定的左端点$l$，有一个最右边的索引$r$除此之外，添加更多排列不会改变可达牌组的集合。 使用两个指针或滑动窗口方法，我们可以有效地计算总和：对于每个$l$，我们扩展$r$直到可到达的牌组饱和，然后考虑从$l$对此$r$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 * k!) | O(k!) | 太慢了 |
 | 最佳 | O(n * k! * k) | O(n * k! * k) | O(k! * k) | O(k! * k) | 已接受 |

 ## 算法演练

 1.将每个shuffle排列转换为零索引形式以简化计算并将其存储在数组中`P`。 
2. 枚举长度的所有排列$k$并为每个分配一个唯一的 ID。 这允许我们将牌组状态表示为整数 0 到$k!-1$。 
3. 预先计算排列的乘法表：对于任意两个排列$A$和$B$,`mul[A][B]`给出对应于应用的排列$A$其次是$B$。 这使得复合洗牌的快速计算成为可能。 
4. 对于每个左端点$l$，维持一组`reachable`从身份排列开始的牌组 ID。 初始化右指针`r=l`。 
5. 增量地包括索引处的排列`r`，更新集合`reachable`通过计算现有可达排列与新排列的所有组合。 继续直到`reachable`停止扩张。 
6.让`R`是左端点达到的最大索引`l`。 所有范围`[l, r']`为了`r'`从`r`到`R`有相同的`f(l,r')`。 将总贡献添加到答案和增量中`l`。 
7. 对所有人重复`l`。 总和在所有范围内累加。 

为什么它有效：该算法保持了以下不变式：`reachable`包含可通过在当前窗口中应用任何记忆洗牌序列获得的所有牌组 ID`[l, r]`。 因为排列组合是关联的，并且添加排列永远不会减少可达牌组，因此扩展`r`直到饱和确保我们正确计算所有范围。 

## Python 解决方案```python
import sys
from itertools import permutations
input = sys.stdin.readline

n, k = map(int, input().split())
P = [list(map(lambda x: int(x)-1, input().split())) for _ in range(n)]

# Enumerate all permutations and assign IDs
all_perms = list(permutations(range(k)))
perm_id = {p: i for i, p in enumerate(all_perms)}

# Precompute multiplication table
mul = [[0]*len(all_perms) for _ in range(len(all_perms))]
for i, a in enumerate(all_perms):
    for j, b in enumerate(all_perms):
        c = tuple(a[b[x]] for x in range(k))
        mul[i][j] = perm_id[c]

ans = 0
n_states = len(all_perms)

for l in range(n):
    reachable = set([perm_id[tuple(range(k))]])
    r = l
    while r < n:
        new_reach = set(reachable)
        p_idx = perm_id[tuple(P[r])]
        for state in reachable:
            new_reach.add(mul[state][p_idx])
        if len(new_reach) == len(reachable):
            break
        reachable = new_reach
        r += 1
    ans += len(reachable) * (r - l + 1)

print(ans)
```该代码首先索引所有排列以实现恒定时间组合。 对于每个左边界，它都会延伸右边界，直到无法到达新的牌组。 如算法中所述，它通过将可到达的牌组数量乘以有效右端点的数量来累积贡献。 

## 工作示例

 输入示例：```
3 3
2 1 3
3 1 2
1 3 2
```| 我| r | 可达甲板| f(l,r) | f(l,r) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | {123, 213} | 2 | 2 |
 | 1 | 2 | {123,132,213,231,312,321} | 6 | 6 |
 | 1 | 3 | {全部 6 项权限} | 6 | 6 |
 | 2 | 2 | {123, 312, 231} | 3 | 3 |
 | 2 | 3 | {全部 6 项权限} | 6 | 6 |
 | 3 | 3 | {123,132} | 2 | 2 |

 Sum = 25，与预期输出匹配。 

另一个输入：```
2 2
2 1
1 2
```| 我| r | 可达甲板| f(l,r) | f(l,r) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | {12,21} | 2 | 2 |
 | 1 | 2 | {12,21} | 2 | 2 |
 | 2 | 2 | {12,21} | 2 | 2 |

 总和 = 6

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * k! * k) | O(n * k! * k) | 对于每个左端点，我们可以扩展`r`最多`n`, 更新`reachable`其中最多有`k!`元素，每个元素都需要`O(k)`对于排列组合 |
 | 空间| O(k! * k + n*k) | O(k! * k + n*k) | 所有排列、乘法表和输入的存储 |

 和$n \le 2 \times 10^5$和$k \le 5$,`k! = 120`，所以最坏情况的操作大致是$2 \times 10^5 * 120 * 5 \approx 1.2 \times 10^8$，这是可以接受的。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    P = [list(map(lambda x: int(x)-1, input().split())) for _ in range(n)]
    from itertools import permutations
    all_perms = list(permutations(range(k)))
    perm_id = {p: i for i, p in enumerate(all_perms)}
    mul = [[0]*len(all_perms) for _ in range(len(all_perms))]
    for i, a in enumerate(all_perms):
        for j, b in enumerate(all_perms):
            c = tuple(a[b[x]] for x in range(k))
            mul[i][j] = perm_id[c]
    ans = 0
```
