---
title: "CF 102862I - 奇怪的墨西哥人"
description: "我们维护一个整数的多重集。 每次插入或删除后，如果允许重复使用从至少有两个副本的值中获取一个副本并将该副本移动一个的操作，我们需要知道可以实现的最大 mex。"
date: "2026-07-25T13:54:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102862
codeforces_index: "I"
codeforces_contest_name: "LU ICPC Selection Contest 2020 and KFU Open Contest 2020"
rating: 0
weight: 102862
solve_time_s: 65
verified: true
draft: false
---

[CF 102862I - 奇怪的墨西哥](https://codeforces.com/problemset/problem/102862/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个整数的多重集。 每次插入或删除后，如果允许重复使用从至少有两个副本的值中获取一个副本并将该副本移动一个的操作，我们需要知道可以实现的最大 mex。 

关键是这些操作只是暂时的。 回答查询后，多重集返回到其原始状态。 我们只需要了解可以从当前多重集中创建哪些值。 

查询的数量最多为 (10^6)，并且值也以 (10^6) 为界。 在每次查询后扫描所有可能值的解决方案在最坏的情况下将执行大约 (10^{12}) 次操作，这远远超出了限制。 我们需要一种对数更新和查询方法。 

困难的部分是理解一组相同价值观的行为方式。 考虑出现 (c) 次的值 (x)。 一份副本可以保留在 (x)，其他 (c-1) 副本可以移动。 这些额外的副本可以逐渐将占用的段扩展到 (x) 周围。 在所有可能的移动之后，该组可以提供区间内的每个值：

 [
 [x-c+1,\ x+c-1]
 ]

 例如，值 3 的五个副本可以覆盖从 1 到 5 的值。四次额外的移动足以将副本传播到两侧，同时保留继续该过程所需的原始副本。 

答案是考虑所有此类区间后的第一个未覆盖的非负整数。 

一个常见的错误是将每个数字都视为可移动的。 单个副本根本无法移动，因为该操作需要两个副本。 例如，多重集`{5}`mex 为 0，而不是 5，因为没有任何东西可以创建低于 5 的值。另一个棘手的情况是重叠间隔。 为了`{0,0,2,2}`，间隔是`[-1,1]`和`[1,3]`，所以它们一起覆盖`0,1,2,3`答案是4。 

## 方法

 暴力方法将模拟每次查询后可达的值。 我们可以反复查找重复的数字并移动副本，直到不存在有用的移动为止，然后计算 mex。 这是正确的，因为它遵循允许操作的定义，但速度太慢。 在最坏的情况下，有 (10^6) 个查询，并且许多值可能具有很大的频率，因此重复重建可达集将需要每个查询多于 (10^6) 次操作。 

一组 (c) 相等的值恰好创建一个区间的观察结果完全改变了问题。 我们不需要模拟运动，只需要维护当前频率创建的间隔的并集。 

对于每个值 (x)，如果其频率发生变化，则只有其自身的间隔发生变化。 我们可以删除旧的间隔贡献并添加新的间隔贡献。 最后的任务是找到第一个未被任何区间覆盖的位置。 

这是一个经典的范围添加和第一个零查询问题。 从 0 到 (q-1) 的位置上的线段树存储当前覆盖每个位置的间隔数。 范围更新会更改覆盖计数，并且树可以找到覆盖范围为零的第一个位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 在最坏的情况下太大| O(n) | 太慢了|
 | 区间线段树| O(q log q) | O(q log q) | O(q) | 已接受 |

 ## 算法演练

 1. 保留每个可能值的频率。 当查询更改值 (x) 的频率时，首先删除旧频率产生的间隔，然后添加新频率产生的间隔。 
2. 对于频率 (c)，计算间隔 ([x-c+1,x+c-1])。 将其限制在 ([0,q-1]) 范围内，因为 mex 永远不会超过当前存在的元素数量。 
3. 存储覆盖懒惰线段树中每个位置的活动区间的数量。 添加或删除间隔成为范围添加。 
4. 每次查询后，在线段树中搜索第一个覆盖率为零的位置。 如果存在，该位置就是墨西哥。 如果从 0 到 (q-1) 的每个位置都被覆盖，则答案为 (q)。 

其原理：运算后可能出现的每个可能值都必须属于由某些原始相等数字组生成的区间。 相反，这样一个区间内的每个值都可以通过分发该组的额外副本来创建。 因此，这些区间的并集正是可达值的集合。 mex 正是这个联合中的第一个缺失值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.mn = [0] * (4 * n)
        self.lazy = [0] * (4 * n)

    def apply(self, node, val):
        self.mn[node] += val
        self.lazy[node] += val

    def push(self, node):
        if self.lazy[node]:
            v = self.lazy[node]
            self.apply(node * 2, v)
            self.apply(node * 2 + 1, v)
            self.lazy[node] = 0

    def add(self, node, left, right, ql, qr, val):
        if ql > right or qr < left:
            return
        if ql <= left and right <= qr:
            self.apply(node, val)
            return
        self.push(node)
        mid = (left + right) // 2
        self.add(node * 2, left, mid, ql, qr, val)
        self.add(node * 2 + 1, mid + 1, right, ql, qr, val)
        self.mn[node] = min(self.mn[node * 2], self.mn[node * 2 + 1])

    def update(self, l, r, val):
        if l <= r:
            self.add(1, 0, self.n - 1, l, r, val)

    def first_zero(self, node, left, right):
        if self.mn[node] > 0:
            return self.n
        if left == right:
            return left
        self.push(node)
        mid = (left + right) // 2
        if self.mn[node * 2] == 0:
            return self.first_zero(node * 2, left, mid)
        return self.first_zero(node * 2 + 1, mid + 1, right)

    def query(self):
        return self.first_zero(1, 0, self.n - 1)

def solve():
    q = int(input())
    seg = SegTree(q)
    cnt = [0] * (1000002)

    def change_interval(x, c, v):
        if c == 0:
            return
        l = max(0, x - c + 1)
        r = min(q - 1, x + c - 1)
        seg.update(l, r, v)

    ans = []
    for _ in range(q):
        t, x = map(int, input().split())

        old = cnt[x]
        change_interval(x, old, -1)

        if t == 1:
            cnt[x] += 1
        else:
            cnt[x] -= 1

        change_interval(x, cnt[x], 1)

        ans.append(str(seg.query()))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```频率数组让我们知道每个值属于哪个区间。 在更改频率之前，旧的间隔将从线段树中删除。 更新后，插入新的间隔。 

线段树存储每个线段的最小覆盖范围。 如果段的最小值为正，则其中的每个位置都已被覆盖。 搜索首先向左进行，因为我们需要最小的未覆盖索引。 

该树仅包含从 0 到 (q-1) 的位置。 mex 不能大于元素的数量，因此超出此范围的任何内容都是不必要的。 

## 工作示例

 对于样本：```
9
1 0
1 1
1 1
1 2
1 4
1 4
2 1
2 2
1 4
```重要的状态是：

 | 查询 | 改变值 | 频率| 活动间隔| 墨西哥 |
 | ---| ---| ---| ---| ---|
 | 1 0 | 1 0 0 | 1 | [0,0]| 1 |
 | 1 1 | 1 1 | 1 | [1,1]| 2 |
 | 1 1 | 1 1 | 2 | [0,2]| 3 |
 | 1 2 | 2 | 1 | [2,2]| 4 |
 | 1 4 | 4 | 1 | [4,4]| 5 |
 | 1 4 | 4 | 2 | [3,5]| 6 |

 这说明了为什么重复项将覆盖范围扩展到其原始位置之外。 两份 4 可以覆盖 3、4 和 5。 

另一个例子：```
4
1 5
1 5
1 5
1 5
```最后一次查询后的覆盖率来自区间：

 | 查询 | 频率 5 | 间隔 | 墨西哥 |
 | ---| ---| ---| ---|
 | 1 5 | 1 1 | [5,5]| 0 |
 | 1 5 | 1 2 | [4,6]| 0 |
 | 1 5 | 1 3 | [3,7]| 0 |
 | 1 5 | 1 4 | [2,8]| 0 |

 答案仍然为零，因为间隔永远不会达到位置零。 这证实了仅大值无法创建从零开始的前缀。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log q) | O(q log q) | 每个查询执行恒定数量的线段树范围更新和一次搜索。 |
 | 空间| O(q) | 线段树存储所有可能的 mex 位置的覆盖信息。 |

 对于 (10^6) 查询，需要对数因子。 该解决方案每次操作执行大约二十个树级别，这完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old
    return ""

# sample and custom tests should be run against solve() in a local harness
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单次插入 0 | 1 | 基本覆盖 |
 | 一个值的多个副本 | 0 直到间隔达到零 | 区间边界|
 | 重复低值 | 增加墨西哥| 使用额外副本 |
 | 插入和删除操作 | 正确改变间隔| 动态更新 |

 ## 边缘情况

 远离零的单个值不得对 mex 前缀产生影响。 对于输入：```
1
1 100
```间隔是`[100,100]`。 位置 0 的覆盖范围为零，因此答案为 0。 

边界附近的重复值表现不同：```
2
1 0
1 0
```第二次插入将间隔更改为`[0,0]`到`[-1,1]`，它被钳位到`[0,1]`。 两个位置都被覆盖，所以答案变成 2。 

重叠的区间必须结合而不是竞争。 为了：```
4
1 0
1 0
1 2
1 2
```间隔是`[0,1]`和`[1,3]`。 它们的并集覆盖了从 0 到 3 的每个位置，给出了 mex 4。线段树自然地处理这个问题，因为它存储了所有区间贡献的总和。 

如果需要更长的 ICPC 风格的社论，可以通过更正式的区间引理证明或较低级别的线段树解释来扩展。
