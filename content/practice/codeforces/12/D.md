---
title: "CF 12D - 球"
description: "每位女士都由三个独立的价值观来描述：美丽、智慧和富有。 如果存在另一位女士的价值观在所有三个维度上都严格更大，那么一位女士就成为“可能的自杀者”。"probable self-mur"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 12
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 12 (Div 2 Only)"
rating: 2400
weight: 12
solve_time_s: 112
verified: true
draft: false
---
[CF 12D - 球](https://codeforces.com/problemset/problem/12/D)

 **评分：** 2400
 **标签：** 数据结构、排序
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每位女士都由三个独立的价值观来描述：美丽、智慧和富有。 如果存在另一位女士的价值观在所有三个维度上都严格更大，那么一位女士就成为“可能的自杀者”。 

正式地，对于女士`i`，我们需要知道是否存在一些`j`这样：

 -`B[j] > B[i]`-`I[j] > I[i]`-`R[j] > R[i]`任务是统计有多少女士满足这个条件。 

输入给出三个长度的数组`N`。 这`k`三个阵列中的第 - 个位置形成一位女士。 输出是一个整数，即占主导地位的女士的数量。 

这些约束完全塑造了解决方案。`N`可以大到`500000`，这排除了任何二次方。 简单的成对比较需要大约`2.5 * 10^11`在最坏的情况下进行检查，这在 2 秒限制内是不可能的。 甚至`O(N sqrt N)`需要在这种规模上认真实施，同时`O(N log N)`是自然目标。 

严格的不平等造成了一些微妙的边缘情况。 

考虑这个输入：```
2
5 5
3 4
1 2
```两位女士都拥有同样的美丽。 尽管第二夫人拥有更大的智慧和财富，但两者都无法支配对方，因为严格来说，美丽也必须更大。 粗心的扫描线实现错误地将相同的美丽处理在一起，可能会计算出其中之一。 

另一个棘手的情况是重复的智力值：```
2
1 2
5 5
1 2
```二夫人的美貌和财富更大，但智力是平等的，所以不会发生统治。 如果我们只检查`>=`如果在一维上出现错误，答案就会变得错误。 

当多名女士拥有相同的美丽和智慧时，就会出现第三个陷阱：```
3
1 1 2
1 1 2
1 2 3
```第一夫人受第三夫人支配。 二夫人也被三夫人支配了。 但第一夫人和第二夫人在加工过程中一定不能互相影响，因为她们的美貌和智慧是平等的。 在相同的组内排序错误会默默地破坏正确性。 

整个问题是一个具有严格不等式的三维优势查询。 

## 方法

 暴力解法直接遵循定义。 对于每一位女士`i`，迭代所有其他女士`j`并检查所有三个属性是否都严格大于。 如果存在这样的女士，请增加答案。 

这是有效的，因为定义本身是成对的。 实现很简单：```
for every i:
    for every j:
        if Bj > Bi and Ij > Ii and Rj > Ri:
            dominated
```问题在于规模。 和`N = 500000`，这大致执行`500000^2 = 2.5 * 10^11`比较。 即使高度优化的 C++ 也无法在限制范围内处理这个问题。 

关键的观察是可以通过排序消除一维。 

假设我们按照美貌降序对女士进行排序。 当处理一位女士时，每一位先前处理过的女士都已经具有严格更大或同等的美丽。 这意味着我们不再需要在所有三个维度上进行搜索。 我们只需要知道：

 > 颜值更高的女子中，有智慧和财富都更大的吗？ 

这将问题简化为动态二维优势查询。 

现在专注于智力。 如果我们按照美丽顺序递减的顺序处理女士，我们就可以维护按智力索引的信息。 对于每一个智力值，我们都想知道迄今为止在拥有更大美貌的女士中所看到的最大丰富程度。 

那么对于现在的女士来说`(B, I, R)`:

 - 查询所有严格大于的智力`I`- 找到其中最大的丰富度
 - 如果最大丰富度大于`R`, 统治存在

 这就变成了范围最大查询问题。 

智力值高达`10^9`，所以直接索引是不可能的。 坐标压缩通过将所有不同的智力值映射到范围内来解决这个问题`[1..M]`。 

最终的结构是：

 - 按美感降序排序
 - 一起处理平等的美容群体
 - 在压缩智力坐标上使用线段树
 - 在每个智力上存储最大的丰富性

 平等的美丽分组是必不可少的。 同等美丽的女士不能互相影响，因为统治严格要求更大的美丽。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(N²) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1. 构造三元组`(beauty, intellect, richness)`对于所有女士。 

每位女士使用一个元组可以使排序和处理变得更容易。 
2. 坐标压缩所有智力值。 

线段树只需要相对排序，而不需要实际值。 压缩转换大值，例如`10^9`变成稠密索引`1`到`M`。 
3. 按美貌降序对所有女士进行排序。 

排序后，每一个已经处理过的组都比当前组有严格更大的美感。 
4、将女士分组处理，美观程度均等。 

这是关键的正确性细节。 同一个美女群里的女士之间是不能互相支配的，所以一定要先查询，后更新。 
5. 对于当前组中的每位女士：

 - 设压缩智力指数为`idx`- 查询范围内的线段树`(idx + 1, M)`- 这问：在经过处理的具有严格更大智力的女士中，最大的丰富度是多少？ 
6.如果查询到的最大丰富度大于当前丰富度，则认为该女士为主导。 

由于所有先前插入的女士也都具有严格的更大的美感，因此所有三个严格的不平等都成立。 
7. 组内所有查询完成后，更新线段树。 

对于每位女士：

 - 在位置`idx`，存储迄今为止看到的最大丰富度

 延迟更新可以防止同样美丽的女士互相影响。 
8. 继续，直到处理完所有组。 

### 为什么它有效

 不变量是：

 > 处理美容团前`B`，线段树恰好包含美丽度严格大于`B`。 

由于降序排序和延迟更新，这个不变量始终成立。 

对于现在的女士来说`(B, I, R)`，查询智力大于`I`查找所有之前处理过的女士：

 - 更大的美丽
 - 更大的智力

 线段树存储了其中的丰富度最大。 如果该最大值超过`R`，那么至少有一位女士在所有三个维度上都支配着当前的一位女士。 

如果不存在这样的丰富性，统治是不可能的，因为每个具有更大美貌和智力的候选人仍然不符合丰富性条件。 

该算法既不会错过有效的支配者，也不会引入无效的支配者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegmentTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (4 * n)

    def update(self, node, left, right, idx, value):
        if left == right:
            self.tree[node] = max(self.tree[node], value)
            return

        mid = (left + right) // 2

        if idx <= mid:
            self.update(node * 2, left, mid, idx, value)
        else:
            self.update(node * 2 + 1, mid + 1, right, idx, value)

        self.tree[node] = max(
            self.tree[node * 2],
            self.tree[node * 2 + 1]
        )

    def query(self, node, left, right, ql, qr):
        if ql > right or qr < left:
            return 0

        if ql <= left and right <= qr:
            return self.tree[node]

        mid = (left + right) // 2

        return max(
            self.query(node * 2, left, mid, ql, qr),
            self.query(node * 2 + 1, mid + 1, right, ql, qr)
        )

def solve():
    n = int(input())

    B = list(map(int, input().split()))
    I = list(map(int, input().split()))
    R = list(map(int, input().split()))

    ladies = []

    intellects = sorted(set(I))
    compress = {
        value: idx + 1
        for idx, value in enumerate(intellects)
    }

    for b, i, r in zip(B, I, R):
        ladies.append((b, compress[i], r))

    ladies.sort(reverse=True)

    m = len(intellects)

    seg = SegmentTree(m)

    ans = 0
    ptr = 0

    while ptr < n:
        nxt = ptr

        while nxt < n and ladies[nxt][0] == ladies[ptr][0]:
            nxt += 1

        for k in range(ptr, nxt):
            _, intellect, richness = ladies[k]

            if intellect < m:
                best = seg.query(
                    1,
                    1,
                    m,
                    intellect + 1,
                    m
                )

                if best > richness:
                    ans += 1

        for k in range(ptr, nxt):
            _, intellect, richness = ladies[k]

            seg.update(
                1,
                1,
                m,
                intellect,
                richness
            )

        ptr = nxt

    print(ans)

solve()
```线段树存储由压缩智能索引的最大丰富度值。 

这`query`操作要求所有智力的最大丰富性严格大于当前的智力。 由于该树只包含具有较大美感的女士，因此该查询与其余两个条件完全匹配。 

平等美团内部的延迟更新是最重要的实现细节。 如果我们在询问一位女士后立即更新，另一位同样美丽的女士可能会错误地将她视为有效的统治者。 

条件：```
if intellect < m:
```避免当前智力已经是最大压缩值时查询空范围。 

线段树存储最大丰富度而不是计数，因为唯一的问题是是否有任何丰富度超过当前丰富度。 仅保留最大值就足够了。 

Python 递归深度在这里是安全的，因为线段树递归深度仅`O(log N)`。 

## 工作示例

 ### 示例 1

 输入：```
3
1 4 2
4 3 2
2 5 3
```女士们是：```
(1,4,2)
(4,3,5)
(2,2,3)
```按颜值降序排序后：```
(4,3,5)
(2,2,3)
(1,4,2)
```压缩智力：```
2 -> 1
3 -> 2
4 -> 3
```| 步骤| 现任女士| 查询范围 | 发现最大丰富度 | 占主导地位？ | 更新后的树 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | (4,2,5) | (3,3) | 0 | 没有 | idx 2 = 5 |
 | 2 | (2,1,3) | (2,1,3) | (2,3) | 5 | 是的 | idx 1 = 3 |
 | 3 | (1,3,2) | (1,3,2) | 空 | 0 | 没有 | idx 3 = 2 |

 最终答案：```
1
```第二夫人以第一夫人为主，因为三个属性都较小。 

### 示例 2

 输入：```
4
5 5 4 3
1 2 3 4
1 2 3 4
```女士们：```
(5,1,1)
(5,2,2)
(4,3,3)
(3,4,4)
```| 步骤| 当前组 | 查询结果 | 支配计数|
 | ---| ---| ---| ---|
 | 1 | 美丽=5 | 没有以前的女士| 0 |
 | 2 | 美丽=4| 高等智力中没有> 3 的丰富度| 0 |
 | 3 | 美丽=3| 高等智力者中没有财富> 4 | 0 |

 最终答案：```
0
```这条痕迹说明了为什么同等美丽分组很重要。 两位美女颜值都很高`5`一定不能互相影响。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N log N) | O(N log N) | 排序加上每位女士一次查询和一次更新 |
 | 空间| O(N) | 压缩数组和线段树|

 和`N = 500000`， 一个`O(N log N)`解决方案在极限范围内表现良好。 线段树运算是对数的，内存使用量保持线性。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    sys.stdin = input_data
    sys.stdout = output_data

    import sys
    input = sys.stdin.readline

    class SegmentTree:
        def __init__(self, n):
            self.n = n
            self.tree = [0] * (4 * n)

        def update(self, node, left, right, idx, value):
            if left == right:
                self.tree[node] = max(self.tree[node], value)
                return

            mid = (left + right) // 2

            if idx <= mid:
                self.update(node * 2, left, mid, idx, value)
            else:
                self.update(node * 2 + 1, mid + 1, right, idx, value)

            self.tree[node] = max(
                self.tree[node * 2],
                self.tree[node * 2 + 1]
            )

        def query(self, node, left, right, ql, qr):
            if ql > right or qr < left:
                return 0

            if ql <= left and right <= qr:
                return self.tree[node]

            mid = (left + right) // 2

            return max(
                self.query(node * 2, left, mid, ql, qr),
                self.query(node * 2 + 1, mid + 1, right, ql, qr)
            )

    def solve():
        n = int(input())

        B = list(map(int, input().split()))
        I = list(map(int, input().split()))
        R = list(map(int, input().split()))

        intellects = sorted(set(I))

        compress = {
            value: idx + 1
            for idx, value in enumerate(intellects)
        }

        ladies = []

        for b, i, r in zip(B, I, R):
            ladies.append((b, compress[i], r))

        ladies.sort(reverse=True)

        seg = SegmentTree(len(intellects))

        ans = 0
        ptr = 0
        m = len(intellects)

        while ptr < n:
            nxt = ptr

            while nxt < n and ladies[nxt][0] == ladies[ptr][0]:
                nxt += 1

            for k in range(ptr, nxt):
                _, intellect, richness = ladies[k]

                if intellect < m:
                    best = seg.query(
                        1,
                        1,
                        m,
                        intellect + 1,
                        m
                    )

                    if best > richness:
                        ans += 1

            for k in range(ptr, nxt):
                _, intellect, richness = ladies[k]

                seg.update(
                    1,
                    1,
                    m,
                    intellect,
                    richness
                )

            ptr = nxt

        print(ans)

    solve()

    sys.stdout = sys.__stdout__

    return output_data.getvalue()

# provided samples
assert run(
"""3
1 4 2
4 3 2
2 5 3
"""
) == "1\n", "sample 1"

# minimum size
assert run(
"""1
5
5
5
"""
) == "0\n", "single lady"

# all equal
assert run(
"""4
1 1 1 1
2 2 2 2
3 3 3 3
"""
) == "0\n", "all equal"

# strictly increasing domination chain
assert run(
"""4
1 2 3 4
1 2 3 4
1 2 3 4
"""
) == "3\n", "every lady except maximum dominated"

# equal beauty should not dominate
assert run(
"""2
5 5
1 2
1 2
"""
) == "0\n", "strict beauty inequality"

# equal intellect should not dominate
assert run(
"""2
1 2
5 5
1 2
"""
) == "0\n", "strict intellect inequality"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单身女士| 0 | 最小输入尺寸 |
 | 所有相同的值 | 0 | 需要严格的不平等|
 | 严格递增三元组 | 3 | 多重有效统治|
 | 平等美丽案例| 0 | 同样的美丽无法主宰|
 | 平等智力案例| 0 | 相同的智力无法主宰|

 ## 边缘情况

 考虑同等的美丽值：```
2
5 5
1 2
1 2
```排序后，两位女士都在同一组。 该算法在进行任何更新之前首先执行所有查询。 由于在两次查询期间线段树仍然为空，因此两位女士都不会被算作主导。 

如果更新立即发生，第二位女士会错误地看到树内的第一位女士，尽管同样美丽。 

现在考虑相等的智力值：```
2
1 2
5 5
1 2
```压缩智力指数是相同的。 查询时，算法只搜索严格大于当前智力的范围：```
idx + 1 ... M
```平等的智力地位被排除在外，因此统治被正确地拒绝。 

最后，一起考虑重复的美丽和智慧：```
3
1 1 2
1 1 2
1 2 3
```前两位女士既有美丽又有智慧。 第三个在两者中都占主导地位。 

加工顺序：

 - 团体`beauty = 2`更新树的丰富度`3`- 团体`beauty = 1`查询树
 - 查询范围排除同等智力
 - 发现的最大丰富度是`3`，超过了两者`1`和`2`答案就变成了`2`，这是正确的。
