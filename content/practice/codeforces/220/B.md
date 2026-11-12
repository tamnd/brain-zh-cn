---
title: "CF 220B - 小象和阵列"
description: "我们得到一个正整数数组和许多范围查询。 对于每个查询 [l, r]，我们仅查看这些位置之间的子数组，并计算有多少值 x 满足非常特定的条件：在该子数组内，值 x 恰好出现 x 次。"
date: "2026-06-04T02:00:02+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 220
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 136 (Div. 1)"
rating: 1800
weight: 220
solve_time_s: 118
verified: true
draft: false
---

[CF 220B - 小象和阵列](https://codeforces.com/problemset/problem/220/B)

 **评分：** 1800
 **标签：** 构造性算法、数据结构
 **求解时间：** 1m 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个正整数数组和许多范围查询。 对于每个查询`[l, r]`，我们只查看这些位置之间的子数组并计算有多少个值`x`满足一个非常具体的条件：

 在该子数组内，值`x`准确地出现`x`次。 

例如，在子数组中```
[3, 1, 2, 2, 3, 3, 7]
```频率是：```
1 -> 1
2 -> 2
3 -> 3
7 -> 1
```价值观`1`,`2`， 和`3`每个出现的次数与它们自己的值完全相同，所以答案是`3`。 

数组长度和查询次数都一样大`100000`。 立即排除重新计算每个查询的频率的简单解决方案。 甚至一个`O(length of range)`每个查询的解决方案大约需要`10^10`最坏情况下的操作。 

值本身可以大到`10^9`。 这意味着我们无法构建直接按值索引的频率结构。 我们只关心数组中实际出现的值。 

一个微妙的观察是任何大于`n`永远无法为答案做出贡献。 值必须准确出现`x`次，但任何范围内的频率都不能超过`n`。 如果`x > n`, 匹配频率`x`是不可能的。 

考虑：```
n = 5
array = [100, 100, 100, 100, 100]
```的频率`100`是`5`， 不是`100`，所以它永远不会做出贡献。 

另一个容易犯的错误是计算出现次数而不是限定值。 例如：```
array = [2, 2]
query = [1, 2]
```价值`2`正好出现两次，所以答案是：```
1
```不是```
2
```因为我们计算满足条件的值，而不是位置。 

当频率在扩大或缩小范围时超过目标值时，就会出现第三个陷阱。 

假设当前频率值`3`变化：```
2 -> 3 -> 4
```当它达到`3`，答案应该增加一。 当它变成`4`，答案应该减一。 忘记这些转换之一会导致错误的结果。 

## 方法

 暴力解决方案独立处理每个查询。 对于查询`[l, r]`，我们扫描整个子数组，用哈希图计算频率，然后计算有多少个值满足：```
frequency[value] == value
```这是正确的，因为它直接实现了定义。 

不幸的是，查询可能几乎覆盖整个数组。 和`100000`查询和长度范围`100000`，工作大致变成：```
100000 × 100000 = 10^10
```这远远超出了时间限制。 

关键的观察结果是查询询问许多重叠范围。 连续查询通常仅在几个元素上有所不同。 从头开始重新计算所有频率会浪费工作量。 

这正是 Mo 算法的闪光点。 我们以特殊顺序对查询进行排序，以便当前范围逐渐变化。 从一个查询移动到下一个查询时，我们仅在当前范围中添加或删除少量元素。 

挑战在于随着频率的变化动态地维持答案。 

假设值`v`目前有频率`cnt[v]`。 

在增加其频率之前，我们检查它是否已经做出了贡献。 如果：```
cnt[v] == v
```那么消除这个等式必然会减少答案。 

更新频率后，我们再次检查。 如果新的频率等于`v`，值开始贡献并且答案增加。 

每个添加/删除操作都变成`O(1)`，并且 Mo 的订购仅保证大约`O((n+m)√n)`总范围调整。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 最优（Mo 算法）| O((n+m)√n) | O((n+m)√n) | O(n) | 已接受 |

 ## 算法演练

 1.读取数组并查询。 
2. 替换每个大于的值`n`具有特殊的无关值。 

这样的价值观永远无法满足`frequency = value`，所以我们不需要在答案逻辑中跟踪它们。 
3. 将每个查询及其原始索引存储在一起。 
4. 选择大约等于的块大小`√n`。 
5. 使用 Mo 的排序对查询进行排序。 

同一左块中的查询按右端点排序。 这可以最大限度地减少指针移动。 
6. 维持当前范围`[curL, curR]`。 

最初范围是空的。 
7. 维护频率数组`cnt`。`cnt[x]`存储多少倍的值`x`出现在当前范围内。 
8. 维护一个变量`answer`。 

这等于当前频率与其值相匹配的值的数量。 
9. 增加价值时`v`:

 首先检查是否`cnt[v] == v`。 如果为真，则递减`answer`因为平等即将被打破。 

增加`cnt[v]`。 

再次检查是否`cnt[v] == v`。 如果为真，则增加`answer`。 
10. 删除值时`v`:

 首先检查是否`cnt[v] == v`。 如果为真，则递减`answer`。 

减少`cnt[v]`。 

再次检查是否`cnt[v] == v`。 如果为真，则增加`answer`。 
11. 对于 Mo 顺序中的每个查询，移动`curL`和`curR`直到当前范围与查询范围匹配。 
12. 存储当前`answer`作为该查询的结果。 
13. 按照原始查询顺序输出答案。 

### 为什么它有效

 每时每刻，`cnt[x]`等于值的频率`x`在 Mo 算法维持的当前范围内。 

变量`answer`精确计算满足以下条件的值：```
cnt[x] = x
```每当频率发生变化时，只有一个值受到影响。 添加/删除例程更新`answer`恰好当该值进入或离开相等条件时。 

由于 Mo 的算法最终准确地访问每个查询范围，并且维护的频率对于当前范围始终是正确的，因此每个查询的存储答案正是出现次数等于其值的值的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    # Values > n can never satisfy freq == value
    a = [x if x <= n else 0 for x in a]

    block = int(n ** 0.5) + 1

    queries = []
    for idx in range(m):
        l, r = map(int, input().split())
        l -= 1
        r -= 1
        queries.append((l, r, idx))

    queries.sort(key=lambda q: (q[0] // block, q[1]))

    cnt = [0] * (n + 1)
    answers = [0] * m
    current_answer = 0

    def add(pos):
        nonlocal current_answer
        v = a[pos]

        if v == 0:
            return

        if cnt[v] == v:
            current_answer -= 1

        cnt[v] += 1

        if cnt[v] == v:
            current_answer += 1

    def remove(pos):
        nonlocal current_answer
        v = a[pos]

        if v == 0:
            return

        if cnt[v] == v:
            current_answer -= 1

        cnt[v] -= 1

        if cnt[v] == v:
            current_answer += 1

    cur_l = 0
    cur_r = -1

    for l, r, idx in queries:
        while cur_l > l:
            cur_l -= 1
            add(cur_l)

        while cur_r < r:
            cur_r += 1
            add(cur_r)

        while cur_l < l:
            remove(cur_l)
            cur_l += 1

        while cur_r > r:
            remove(cur_r)
            cur_r -= 1

        answers[idx] = current_answer

    sys.stdout.write("\n".join(map(str, answers)))

if __name__ == "__main__":
    solve()
```第一个预处理步骤替换所有大于的值`n`和`0`。 这些值永远不会有贡献，因为频率不能超过`n`。 这避免了浪费时间来维护永远无法满足条件的频率。 

这`cnt`数组仅存储以下值的频率`1`到`n`。 价值`0`被完全忽略。 

最微妙的部分是更新逻辑。 当频率发生变化时，我们必须在修改计数之前删除其旧的贡献，然后添加其新的贡献。 每当频率超过其目标值时，颠倒该顺序就会导致相差一的错误。 

Mo算法所维护的范围包括两端。 实现从一个空范围开始`[0, -1]`，然后扩展或缩小，直到与每个查询匹配。 

## 工作示例

 ### 示例 1

 输入：```
7 2
3 1 2 2 3 3 7
1 7
3 4
```按排序顺序的查询恰好与输入顺序匹配。 

适用范围`[1,7]`:

 | 价值| 频率| 贡献？ |
 | --- | --- | --- |
 | 1 | 1 | 是的 |
 | 2 | 2 | 是的 |
 | 3 | 3 | 是的 |
 | 7 | 1 | 没有 |

 答案=3。 

适用范围`[3,4]`:```
[2, 2]
```| 价值| 频率| 贡献？ |
 | --- | --- | --- |
 | 2 | 2 | 是的 |

 答案 = 1。 

输出：```
3
1
```这个例子演示了核心条件。 仅当某个值的频率等于该值本身时，该值才有贡献。 

### 示例 2

 输入：```
5 1
1 1 1 1 1
1 5
```当前范围成为整个数组。 

| 价值| 频率| 贡献？ |
 | --- | --- | --- |
 | 1 | 5 | 没有 |

 回答：```
0
```跟踪表明匹配值确实很重要。 频率大于该值的不算数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m)√n) | O((n + m)√n) | Mo 的算法执行 O((n+m)√n) 次指针移动，每次更新的时间为 O(1) |
 | 空间| O(n + m) | 频率数组、查询存储和答案存储 |

 和`n,m ≤ 100000`，我们有`√n ≈ 316`。 由此产生的更新数量完全在 4 秒 Codeforces 问题的限制之内，并且内存使用量轻松低于 256 MB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    import math

    input = sys.stdin.readline

    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    a = [x if x <= n else 0 for x in a]

    block = int(n ** 0.5) + 1

    queries = []
    for idx in range(m):
        l, r = map(int, input().split())
        queries.append((l - 1, r - 1, idx))

    queries.sort(key=lambda q: (q[0] // block, q[1]))

    cnt = [0] * (n + 1)
    ans = [0] * m
    cur_ans = 0

    def add(pos):
        nonlocal cur_ans
        v = a[pos]
        if v == 0:
            return
        if cnt[v] == v:
            cur_ans -= 1
        cnt[v] += 1
        if cnt[v] == v:
            cur_ans += 1

    def remove(pos):
        nonlocal cur_ans
        v = a[pos]
        if v == 0:
            return
        if cnt[v] == v:
            cur_ans -= 1
        cnt[v] -= 1
        if cnt[v] == v:
            cur_ans += 1

    lcur, rcur = 0, -1

    for l, r, idx in queries:
        while lcur > l:
            lcur -= 1
            add(lcur)

        while rcur < r:
            rcur += 1
            add(rcur)

        while lcur < l:
            remove(lcur)
            lcur += 1

        while rcur > r:
            remove(rcur)
            rcur -= 1

        ans[idx] = cur_ans

    return "\n".join(map(str, ans))

# provided sample
assert run(
"""7 2
3 1 2 2 3 3 7
1 7
3 4
"""
) == "3\n1"

# minimum size
assert run(
"""1 1
1
1 1
"""
) == "1"

# value larger than n
assert run(
"""3 1
100 100 100
1 3
"""
) == "0"

# all equal values
assert run(
"""5 1
2 2 2 2 2
1 5
"""
) == "0"

# exact frequency match
assert run(
"""4 1
2 2 1 3
1 2
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元件`[1]`|`1`| 最小约束|
 | 所有值`100`和`n=3`|`0`| 值大于`n`是无关紧要的|
 |`[2,2,2,2,2]`|`0`| 大于该值的频率不计入 |
 | 范围`[2,2]`|`1`| 精确的频率匹配 |
 | 官方样品|`3,1`| 一般正确性 |

 ## 边缘情况

 考虑：```
3 1
100 100 100
1 3
```自从`100 > n`，该值永远不可能准确地出现`100`次。 预处理将所有条目转换为`0`，更新例程会忽略它们，并且保留的答案仍然存在`0`。 

考虑：```
2 1
2 2
1 2
```值的频率`2`正是`2`。 插入期间，计数发生变化：```
0 -> 1 -> 2
```当它达到`2`，答案加一。 最终输出是：```
1
```这是正确的，因为只有值`2`符合资格。 

考虑：```
4 1
3 3 3 3
1 4
```频率转换：```
0 -> 1 -> 2 -> 3 -> 4
```按频率`3`，价值贡献。 按频率`4`，它停止贡献。 更新逻辑在增加计数之前删除贡献，并且仅当之后相等仍然成立时才恢复它。 最终的答案是：```
0
```这与定义完全匹配。
