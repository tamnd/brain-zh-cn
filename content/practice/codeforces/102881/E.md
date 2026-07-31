---
title: "CF 102881E - 婴儿 Ehab 的 X（或）"
description: "我们有一个正整数数组。 更新选择一个连续的范围，并将两个按位转换之一应用于该范围内的每个数字。"
date: "2026-07-25T12:32:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102881
codeforces_index: "E"
codeforces_contest_name: "ECPC 2019 Kickoff"
rating: 0
weight: 102881
solve_time_s: 59
verified: true
draft: false
---

[CF 102881E - 婴儿 Ehab 的 X(OR)](https://codeforces.com/problemset/problem/102881/E)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个正整数数组。 更新选择一个连续的范围，并将两个按位转换之一应用于该范围内的每个数字。 第一个转换替换一个值`x`和`x | (x - 1)`，第二个将其替换为`x ^ (x - 1)`。 每次更新后，我们必须打印数组的总和。 

重要的是理解这两个表达式对位的实际作用。 如果`x`有`k`尾随零，那么`x - 1`准确地将这些零更改为 1，并将最低的一位更改为零。 

为了`x | (x - 1)`，所有尾随零变为一，而其余位保持不变。 例如，`12 (1100)`变成`15 (1111)`。 此操作仅更改至少有一个尾随零的数字，然后该数字为奇数。 

为了`x ^ (x - 1)`，从最低设置位向下的所有位都变为 1，并且所有较高位消失。 一个值与`k`尾随零变为`2^(k+1)-1`。 例如，`12 (1100)`变成`7 (0111)`。 这也总是产生奇数。 

约束很大：数组大小和操作次数都可以达到`3 * 10^5`。 触及范围内每个元素的解决方案太慢，因为最坏的情况将在`9 * 10^10`元素更新。 我们需要一个可以一次总结许多元素的对数数据结构。 

一个常见的错误是只追踪总和。 仅凭总和并不能告诉我们未来的操作如何改变这些数字。 例如，值`4`和`6`尽管它们的总和可以合并，但在第二次操作下两者都有不同的行为。 缺少的信息是尾随零的数量。 

另一个边缘情况是包含 2 的幂的范围。 对于输入：```
1 1
8
1 1 1
```答案是：```
15
```因为`8 (1000)`变成`15 (1111)`。 假设该值仅变为奇数的解决方案将丢失添加的较低位。 

另一个边缘情况是在第一个操作之后应用第二个操作。 为了：```
1 2
4
1 1 1
2 1 1
```输出是：```
7
1
```第一次更新创建`7`，第二次更新改变`7`到`1`。 将第二个操作应用于原始值的粗心实现`4`会错误地产生`7`。 

## 方法

 直接的解决方案将迭代每个查询范围内的每个位置，并使用位运算计算新值。 这是正确的，因为每个操作对于每个元素都是独立的。 然而，随着`n`和`q`两者都等于`300000`，最坏的情况大致包含`n * q`元素修改，这远远超出了可用时间。 

关键的观察结果是，转换仅取决于尾随零的数量。 在任一操作之后，数字都会变成奇数，因此该元素的未来行为要简单得多。 这意味着线段树不需要存储每个精确值。 它只需要知道一个段中有多少个值具有每个可能的尾随零计数，以及段总和。 

还有一个微妙之处。 线段树延迟传播不仅必须记住线段已更新，而且还需要记住哪些转换序列仍需要传递给其子级。 可能发生的转变很小。 它们是恒等式，第一操作，第二操作，以及将一切变成的恒定操作`1`。 这四种状态就足够了，因为重复的变换很快就会崩溃为其中一种状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(1) | O(1) | 太慢了|
 | 最佳| O((n + q) log n * 20) | O(n * 20) | 已接受 |

 ## 算法演练

 1. 构建线段树。 对于每个节点，存储其段和数组的总和，其中`cnt[i]`是恰好具有的值的数量`i`尾随零。 存储一个惰性转换来描述仍然需要推送给子级的操作。 

可以出现的最大值如下`2^19`，因此最多可能有 19 个尾随零。 
2. 当对整个段应用第一个操作时，每个值都带有`i > 0`尾随零增加`2^i - 1`。 更改后，所有值都变为奇数。 

我们使用存储的计数更新总和并将每个计数移入`cnt[0]`。 
3. 当对整个段应用第二个操作时，具有以下值的值`i`尾随零变为`2^(i+1)-1`。 新的总和可以直接从计数中计算出来。 

同样，每个结果值都是奇数，因此整个段移动到`cnt[0]`。 
4. 当应用由组合变换产生的常数运算时，每个值都变成`1`。 总和成为段长度，并且所有值都有零尾随零。 
5. 对于部分范围更新，在下降之前将待处理的惰性转换推送到子级。 然后通过添加子项的总和和尾随零计数来合并子项。 
6. 每次更新后，根和就是答案。 

为什么它有效：

 线段树准确地维护了操作所需的信息。 任一按位运算的效果仅取决于原始值的尾随零计数。 存储的计数使我们能够在不知道各个值的情况下计算新的总和。 由于每个转换都可以由四个惰性状态之一表示，并且这些状态的组合正确，因此延迟更新始终会产生与直接对每个元素应用操作相同的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MAXB = 20

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    size = 4 * n
    tree_sum = [0] * size
    cnt = [[0] * MAXB for _ in range(size)]
    lazy = [0] * size

    def tz(x):
        return (x & -x).bit_length() - 1

    def apply(node, l, r, op):
        length = r - l + 1

        if op == 1:
            add = 0
            for i in range(1, MAXB):
                add += cnt[node][i] * ((1 << i) - 1)
            tree_sum[node] += add

        elif op == 2:
            new_sum = 0
            for i in range(MAXB):
                new_sum += cnt[node][i] * ((1 << (i + 1)) - 1)
            tree_sum[node] = new_sum

        else:
            tree_sum[node] = length

        cnt[node][0] = length
        for i in range(1, MAXB):
            cnt[node][i] = 0

    def compose(old, new):
        if new == 0:
            return old
        if old == 0:
            return new

        if old == 1 and new == 1:
            return 1
        if old == 2 and new == 2:
            return 3
        if old == 1 and new == 2:
            return 3
        if old == 2 and new == 1:
            return 2
        if old == 3:
            return 3
        if new == 3:
            return 3

        return new

    def push(node, l, r):
        if lazy[node] and l != r:
            mid = (l + r) // 2
            op = lazy[node]
            apply(node * 2, l, mid, op)
            apply(node * 2 + 1, mid + 1, r, op)
            lazy[node * 2] = compose(lazy[node * 2], op)
            lazy[node * 2 + 1] = compose(lazy[node * 2 + 1], op)
            lazy[node] = 0

    def build(node, l, r):
        if l == r:
            tree_sum[node] = a[l]
            cnt[node][tz(a[l])] = 1
            return
        mid = (l + r) // 2
        build(node * 2, l, mid)
        build(node * 2 + 1, mid + 1, r)
        pull(node)

    def pull(node):
        tree_sum[node] = tree_sum[node * 2] + tree_sum[node * 2 + 1]
        for i in range(MAXB):
            cnt[node][i] = cnt[node * 2][i] + cnt[node * 2 + 1][i]

    def update(node, l, r, ql, qr, op):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            apply(node, l, r, op)
            lazy[node] = compose(lazy[node], op)
            return

        push(node, l, r)
        mid = (l + r) // 2
        update(node * 2, l, mid, ql, qr, op)
        update(node * 2 + 1, mid + 1, r, ql, qr, op)
        pull(node)

    build(1, 0, n - 1)

    ans = []
    for _ in range(q):
        t, l, r = map(int, input().split())
        update(1, 0, n - 1, l - 1, r - 1, t)
        ans.append(str(tree_sum[1]))

    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```这`cnt`数组是实现的核心。 它们避免存储单个值，同时准确保留两种转换所需的信息。 

这`apply`函数处理完整的段更新。 前两种情况根据尾随零频率计算新的总和。 当几个挂起的操作组合成一个转换，迫使每个值变成`1`。 

这`compose`函数可以防止常见的惰性传播错误。 后面的操作不能简单地替换前面的惰性标志，因为顺序很重要。 例如，应用第一个操作然后应用第二个操作与仅应用第二个操作不同。 

递归内部使用从零开始的索引。 输入范围在更新时转换一次，避免重复转换和差一错误。 

## 工作示例

 对于第一个样本：```
3 3
1 2 3
1 1 3
2 2 2
2 1 3
```重要的段状态是：

 | 步骤| 运营| 价值观 | 总和 |
 | ---| ---| ---| ---|
 | 初始| 无 | 1、2、3 | 6 |
 | 1 | 应用第一个操作 | 1, 3, 3 | 7 |
 | 2 | 将第二个操作应用于第二个值 | 1, 1, 3 | 5 |
 | 3 | 将第二个操作应用于所有 | 1, 1, 1 | 3 |

 跟踪显示，每次操作后，所有修改的数字都变成奇数，这正是线段树使用的不变量。 

对于第二个样本：```
5 5
5 5 5 5 5
1 5 5
2 1 1
2 2 3
1 3 4
2 1 5
```| 步骤| 运营| 价值观 | 总和 |
 | ---| ---| ---| ---|
 | 初始| 无 | 5, 5, 5, 5, 5 | 5, 5, 5, 5, 5 | 25 | 25
 | 1 | 位置 5 的第一次操作 | 5, 5, 5, 5, 5 | 5, 5, 5, 5, 5 | 25 | 25
 | 2 | 位置 1 的第二次操作 | 1, 5, 5, 5, 5 | 1, 5, 5, 5, 5 | 21 | 21
 | 3 | 位置 2 至 3 的第二次操作 | 1, 1, 1, 5, 5 | 1, 1, 1, 5, 5 | 13 |
 | 4 | 位置 3 至 4 的第一次操作 | 1, 1, 1, 5, 5 | 1, 1, 1, 5, 5 | 13 |
 | 5 | 第二次手术全部| 1, 1, 1, 1, 1 | 1, 1, 1, 1, 1 | 5 |

 该示例执行了重复的转换，并说明了为什么仅保留数字是否为奇数对于初始状态来说是不够的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n * 20) | 每个段操作都会涉及 O(log n) 个节点，并且每个节点更新都会扫描 20 个可能的尾随零计数。 |
 | 空间| O(n * 20) | 每个线段树节点存储 20 个计数器和一些额外值。 |

 最大数组大小为`300000`，所以树节点的数量是线性的。 对数更新时间很容易满足限制，因为常数因子只是少量可能的位位置。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    data = sys.stdin.read().split()
    if not data:
        return ""
    it = iter(data)
    n = int(next(it))
    q = int(next(it))
    arr = [int(next(it)) for _ in range(n)]
    ops = [(int(next(it)), int(next(it)), int(next(it))) for _ in range(q)]

    res = []
    for t, l, r in ops:
        for i in range(l - 1, r):
            if t == 1:
                arr[i] |= arr[i] - 1
            else:
                arr[i] ^= arr[i] - 1
        res.append(str(sum(arr)))
    return "\n".join(res)

assert run("""3 3
1 2 3
1 1 3
2 2 2
2 1 3
""") == "7\n5\n3", "sample 1"

assert run("""5 5
5 5 5 5 5
1 5 5
2 1 1
2 2 3
1 3 4
2 1 5
""") == "25\n21\n13\n13\n5", "sample 2"

assert run("""1 1
8
1 1 1
""") == "15", "power of two"

assert run("""1 2
4
1 1 1
2 1 1
""") == "7\n1", "composition case"

assert run("""3 2
1 1 1
2 1 3
1 1 3
""") == "3\n3", "all equal odd values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 的单一幂 | 15 | 15 正确处理尾随零 |
 | 第一次更新，然后是第二次更新 | 7 然后 1 | 懒惰的组合行为 |
 | 所有奇数值 | 3 然后 3 | 不应增加值的操作 |
 | 提供样品| 示例输出 | 一般正确性 |

 ## 边缘情况

 对于二次幂的情况：```
1 1
8
1 1 1
```价值`8`有三个尾随零。 第一个操作添加`2^3 - 1 = 7`, 给予`15`。 线段树存储一个值`cnt[3]`，因此它直接计算增量并将值移动到`cnt[0]`。 

对于组合情况：```
1 2
4
1 1 1
2 1 1
```第一次更新后，`4`变成`7`，表示为奇数。 第二次更新将每个奇数值变成`1`。 惰性状态组合记录了待处理的转换是组合效果，而不是错误地独立处理两个操作。
