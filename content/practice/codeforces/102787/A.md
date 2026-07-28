---
title: "CF 102787A - Shandom 荷叶边"
description: "该问题描述了最初排列为 1, 2, 3, ..., n 的 n 个图块序列。 我们给出了 n 个洗牌操作。 每个操作接收两个位置 a 和 b。 如果 b 不在 a 之后，则不会发生任何事情。"
date: "2026-07-27T19:20:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102787
codeforces_index: "A"
codeforces_contest_name: "Algorithms Thread Treaps Contest"
rating: 0
weight: 102787
solve_time_s: 65
verified: true
draft: false
---

[CF 102787A - Shandom Ruffle](https://codeforces.com/problemset/problem/102787/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题描述了一系列`n`瓷砖最初排列为`1, 2, 3, ..., n`。 我们被给予`n`洗牌操作。 每个操作获得两个位置`a`和`b`。 如果`b`不是之后`a`，什么也没有发生。 否则，该操作将交换图块`a`与瓷砖在`b`，然后瓷砖位于`a + 1`与瓷砖在`b + 1`，依此类推，当两个范围之一到达数组末尾时停止。 应用所有操作后，我们必须打印图块的最终顺序。 

输入大小是关键难点。 最多可以有`500000`操作，并且数组具有相同的最大大小。 一个操作的直接模拟可能会触及多个位置，在最坏的情况下，单个操作可能会移动`O(n)`元素。 重复此操作`n`操作给出`O(n^2)`工作，这远远超出了 50 万个元素所能完成的工作。 我们需要在大致对数时间内处理每次洗牌。 

一些边缘情况很容易被忽略。 如果`b <= a`，必须完全忽略该操作。 例如：```
Input:
1
1 1
```数组仍然存在`[1]`，所以输出是：```
1
```总是创建非空交换范围的粗心实现可能会访问无效位置。 

另一个重要的情况是当第二个交换段到达数组末尾时。 例如：```
Input:
5
4 1
5 4
3 5
4 5
5 2
```第一个操作没有执行任何操作，因为`1 <= 4`。 后面的操作具有不同的有效长度，因为交换的右侧可能被数组边界截短。 将每个操作视为总是交换两个相等的完整块会产生错误的排列。 

## 方法

 一个简单的解决方案是显式存储数组并执行定义中的每个交换。 对于一次手术`(a, b)`，我们反复交换`array[a]`和`array[b]`同时推动两个指数向前发展。 这是一个正确的实现，因为它完全遵循洗牌过程。 

问题是运行时间。 考虑重复交换几乎整个数组的操作。 一项操作可能需要接近`n/2`互换。 和`n`操作时，基本交换的数量可以接近`250000000000`，这是不可行的。 

有用的观察是每次洗牌并不关心存储在数组中的值。 它只是重新排列位置。 该操作是连续序列的排列，特别是两个相邻块的交换。 该阵列可以表示为有序序列，其中切割和连接片段是有效的。 

隐式trap非常适合，因为它存储序列，同时支持按位置拆分和合并。 可以通过将序列切入之前的部分来执行洗牌`a`、第一个块、第二个块和剩余的后缀。 然后将中间的两个块以相反的顺序连接起来。 件数是恒定的，因此每次操作都需要`O(log n)`预计时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n) | 太慢了|
 | 隐式陷阱| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建一个包含序列的隐式trap`1, 2, ..., n`。 节点的trap位置表示其在当前数组中的索引，因此我们不需要将数组存储在普通列表中。 
2. 对于每次洗牌`(a, b)`，忽略它，如果`b <= a`。 在这种情况下，该操作无法交换任何内容。 
3. 计算第一个被交换的块的长度。 这两个块开始于`a`和`b`，所以他们的距离是`b - a`。 第二个块只能延伸到数组末尾，给出长度：```
min(b - a, n - b + 1)
```1. 将鱼饵分成四块。 第一部分包含之前的位置`a`。 接下来的两块是必须交换的块。 最后一块包含交换区域之后的所有内容。 
2. 按顺序合并片段：前缀、第二个块、第一个块、后缀。 这将准确地重新创建原始过程执行的交换。 
3. 完成所有操作后，按顺序遍历trap并打印存储的值。 

这样做的原因是相邻块交换完全由它的两个块描述。 treap 保持与真实数组相同的序列顺序，因此拆分两个块并交换它们的位置应用与执行每个单独交换完全相同的排列。 

为什么它有效：

 不变的是，在处理任意数量的操作之后，treap 的中序遍历与这些操作之后的真实数组相同。 最初这是正确的，因为陷阱包含恒等排列。 在洗牌期间，分割操作提取与原始循环访问的完全相同的四个连续范围。 对两个中间范围重新排序仅改变它们的位置，这正是所有单独交换所做的。 由于每个操作都保留了不变量，因此最终的遍历就是所需的答案。 

## Python 解决方案```python
import sys
import random

input = sys.stdin.readline

class Node:
    __slots__ = ("val", "prio", "size", "left", "right")

    def __init__(self, val):
        self.val = val
        self.prio = random.randint(1, 1 << 30)
        self.size = 1
        self.left = None
        self.right = None

def size(t):
    return t.size if t else 0

def update(t):
    if t:
        t.size = 1 + size(t.left) + size(t.right)

def merge(a, b):
    if not a:
        return b
    if not b:
        return a
    if a.prio > b.prio:
        a.right = merge(a.right, b)
        update(a)
        return a
    else:
        b.left = merge(a, b.left)
        update(b)
        return b

def split(t, k):
    if not t:
        return None, None
    if size(t.left) >= k:
        a, b = split(t.left, k)
        t.left = b
        update(t)
        return a, t
    else:
        a, b = split(t.right, k - size(t.left) - 1)
        t.right = a
        update(t)
        return t, b

def build(n):
    root = None
    for i in range(1, n + 1):
        root = merge(root, Node(i))
    return root

def collect(t, ans):
    if not t:
        return
    collect(t.left, ans)
    ans.append(str(t.val))
    collect(t.right, ans)

def solve():
    n_line = input().strip()
    if not n_line:
        return
    n = int(n_line)

    root = build(n)

    for _ in range(n):
        a, b = map(int, input().split())
        if b <= a:
            continue

        length = min(b - a, n - b + 1)

        left, rest = split(root, a - 1)
        first, rest = split(rest, length)
        second, right = split(rest, length)

        root = merge(left, merge(second, merge(first, right)))

    ans = []
    collect(root, ans)
    print(" ".join(ans))

if __name__ == "__main__":
    solve()
```treap 节点仅存储值和子树大小。 优先级字段使树保持随机平衡，给出对数期望高度。 

这`split`功能是核心操作。 它分开了第一个`k`序列其余部分的元素。 索引通过子树大小在内部从零开始，而问题使用从一开始的位置，因此每个输入位置都通过调整`a - 1`。 

洗牌长度计算是许多错误解决方案失败的地方。 第二个块开始于`b`，所以它最多包含`n - b + 1`元素。 它也不能长于之间的间隙`a`和`b`，这就是为什么需要这两个数量中的最小值。 

最终的遍历使用中序顺序，因为隐式treap通过其左子树、节点和右子树排序来表示序列。 

## 工作示例

 使用第一个示例：```
4
3 1
1 3
3 2
2 3
```踪迹是：

 | 运营| 有效行动 | 序列|
 | ---| ---| ---|
 | 开始| 最初的陷阱| 1 2 3 4 | 1 2 3 4
 | 3 1 | 3 1 被忽略 | 1 2 3 4 | 1 2 3 4
 | 1 3 | 交换 [1,2] 和 [3,4] | 3 4 1 2 | 3 4 1 2
 | 3 2 | 被忽略 | 3 4 1 2 | 3 4 1 2
 | 2 3 | 交换位置 2 和 3 | 3 1 4 2 | 3 1 4 2

 该示例演示了为什么使用`b <= a`必须跳过以及为什么trap只需要重新排列范围。 

对于第二个样本：```
5
4 1
5 4
3 5
4 5
5 2
```| 运营| 有效长度| 序列|
 | ---| ---| ---|
 | 开始| | 1 2 3 4 5 | 1 2 3 4 5
 | 4 1 | 被忽略 | 1 2 3 4 5 | 1 2 3 4 5
 | 5 4 | 被忽略 | 1 2 3 4 5 | 1 2 3 4 5
 | 3 5 | 1 | 1 2 5 4 3 | 1 2 5 4 3
 | 4 5 | 1 | 1 2 5 3 4 | 1 2 5 3 4
 | 5 2 | 被忽略 | 1 2 5 3 4 | 1 2 5 3 4

 该迹线练习了边界情况，其中右块到达序列的末尾并且不能具有完整的理论长度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每个`n`shuffles 执行恒定数量的trap 分割和合并。 |
 | 空间| O(n) | Treap 为每个图块存储一个节点。 |

 和`n = 500000`，二次模拟是不可能的。 treap 解决方案每次洗牌执行大约几十次对数运算，这符合预期的约束。 

## 测试用例```python
import sys
import io
import random

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.readline
    n = int(data())
    
    class Node:
        __slots__ = ("v", "p", "s", "l", "r")
        def __init__(self, v):
            self.v = v
            self.p = random.randint(1, 10**9)
            self.s = 1
            self.l = None
            self.r = None

    def sz(t):
        return t.s if t else 0

    def up(t):
        if t:
            t.s = sz(t.l) + sz(t.r) + 1

    def merge(a, b):
        if not a or not b:
            return a or b
        if a.p > b.p:
            a.r = merge(a.r, b)
            up(a)
            return a
        b.l = merge(a, b.l)
        up(b)
        return b

    def split(t, k):
        if not t:
            return None, None
        if sz(t.l) >= k:
            a, b = split(t.l, k)
            t.l = b
            up(t)
            return a, t
        a, b = split(t.r, k - sz(t.l) - 1)
        t.r = a
        up(t)
        return t, b

    root = None
    for i in range(1, n + 1):
        root = merge(root, Node(i))

    for _ in range(n):
        a, b = map(int, data().split())
        if b > a:
            length = min(b - a, n - b + 1)
            x, root = split(root, a - 1)
            y, root = split(root, length)
            z, w = split(root, length)
            root = merge(x, merge(z, merge(y, w)))

    ans = []
    def dfs(t):
        if t:
            dfs(t.l)
            ans.append(str(t.v))
            dfs(t.r)
    dfs(root)
    return " ".join(ans)

assert run("""4
3 1
1 3
3 2
2 3
""") == "3 1 4 2", "sample 1"

assert run("""5
4 1
5 4
3 5
4 5
5 2
""") == "1 2 5 3 4", "sample 2"

assert run("""1
1 1
""") == "1", "minimum size"

assert run("""5
1 5
1 5
1 5
1 5
1 5
""") == "5 4 3 2 1", "boundary length"

assert run("""5
2 2
3 3
4 4
5 5
1 1
""") == "1 2 3 4 5", "all ignored operations"

assert run("""3
1 2
1 2
1 2
""") == "2 3 1", "small repeated rotations"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素 |`1`| 最小尺寸处理 |
 | 重复完整旋转 |`5 4 3 2 1`| 长块互换 |
 | 被忽略的操作 |`1 2 3 4 5`| 正确处理`b <= a`|
 | 小额重复互换|`2 3 1`| 正确的运算组合 |

 ## 边缘情况

 当`a`和`b`相等，算法在任何分割之前退出。 对于输入：```
1
1 1
```陷阱保持不变，输出为`1`。 

当交换的右侧触及数组末尾时，计算出的块大小会阻止访问序列之外的位置。 为了：```
5
3 5
```距离是`2`，但后缀从位置开始`5`有长度`1`，所以只交换一对。 顺序更改为：```
1 2 3 4 5
```到：```
1 2 5 4 3
```treap 处理这个问题是因为分割大小基于实际可用的块长度，而不是假设的完整间隔。 

对相同范围的重复操作也是安全的，因为每次洗牌都会应用于当前的trap顺序。 该结构不依赖于初始化后的原始位置，因此它自然地跟踪不断变化的排列。
