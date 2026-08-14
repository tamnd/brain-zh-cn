---
title: "CF 102341A - 阿拉卡扎姆"
description: "我们有一个勺子计数数组，其中位置 i 最初包含 a[i]。 shuffle l r 操作获取当前位于区间 [l, r] 中的每个值，并在相同位置之间随机排列这些值。"
date: "2026-08-13T03:02:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "A"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 643
verified: true
draft: false
---

[CF 102341A - Alakazam](https://codeforces.com/problemset/problem/102341/A)

 **评级：** -
 **标签：** -
 **求解时间：** 10m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列勺子计数，其中位置`i`最初包含`a[i]`。 一个`shuffle l r`运算采用当前位于区间内的每个值`[l, r]`并在相同位置之间随机排列这些值。 一个`get i`操作要求位置的期望值`i`经过之前的所有洗牌之后。 

主要困难在于实际排列是随机的，因此我们无法维护一个具体的数组。 我们需要维持每个位置的期望值。 洗牌不会保留单个位置的期望值，但它会保留整个洗牌间隔的总和。 

和`n, q <= 250000`，扫描每个操作的整个间隔的方法可能需要大约`nq`，这大约是`6.25 * 10^10`最坏情况下的元素操作。 这远远超出了 2 秒竞技编程限制所能支持的范围。 我们需要每个操作只触及对数个数据结构节点。 

在几种边界情况下，直接实现可能会默默地出错。 例如，如果打乱的间隔仅包含一个位置```
1 2
7
shuffle 1 1
get 1
```答案是`7.000000000000`。 将每次洗牌视为更改值的粗心实现可能会引入不必要的舍入或平均操作，尽管在数学上间隔平均值仍然准确`7`。 

一个更具启发性的例子是整个数组的洗牌：```
3 2
1 2 6
shuffle 1 3
get 2
```答案是`3.000000000000`，因为每个位置都有相同的可能性接收这三个值中的每一个。 只看原来位置的值`2`会错误地产生`2`。 

另一个常见的边界错误是忘记端点是包容性的：```
3 2
1 2 9
shuffle 1 2
get 2
```期望值为`1.500000000000`。 位置`3`未受影响，而位置`1`和`2`两者都成为平均值`1`和`2`。 无意中使用的一个实现`[l, r)`会离开职位`2`不变并返回`2`。 

重复重叠的洗牌是仅存储原始数组是不够的另一种情况：```
3 4
1 2 3
shuffle 1 2
shuffle 2 3
get 1
get 3
```答案是`1.500000000000`和`2.250000000000`。 第二次随机播放必须使用第一次随机播放产生的预期值，而不是原始值`2`和`3`。 

## 方法

 蛮力方法很简单。 维持当前每个仓位的预期值。 为了`shuffle l r`，计算期望值的总和`l`通过`r`, 除以`r-l+1`，并将该平均值写入间隔的每个位置。 为了`get i`，只需打印位置的当前值`i`。 

这是正确的，因为在对中的值进行均匀随机排列之后`[l,r]`，该区间内的每个位置都有相同的概率接收每个值。 如果当前的期望值是`E_l, E_{l+1}, ..., E_r`，期望的线性度给出了每个位置的新期望：

 [
 \frac{E_l+E_{l+1}+\cdots+E_r}{r-l+1}。 
]

 问题是成本。 随机播放可以包含`250000`位置，并且在最坏的情况下所有`250000`操作可以是整个数组的洗牌。 更新每个位置大约需要

 [
 250000 \times 250000 = 62,500,000,000
 ]

 位置更新，甚至在计算总和之前。 

消除这一瓶颈的观察结果是，在洗牌之后，整个区间有一个共同的期望值。 一旦发生洗牌，我们就不需要记住该区间内的各个期望值。 我们只需要洗牌之前的区间总和，然后我们就可以惰性地将整个区间标记为具有一个常量值。 

这正是范围赋值与范围求和查询的结合。 惰性线段树可以表示以下两种操作`O(log n)`。 每个树节点存储其区间的总和，并在必要时存储惰性赋值，表示区间中的每个位置当前具有相同的期望值。 

蛮力方法之所以有效，是因为它明确执行数学所需的相同范围分配，但它具体化了每个单独的分配。 线段树将该分配压缩在树节点内。 整个区间可以用一个数字来表示，而不用重写它的所有位置。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(nq)`|`O(n)`| 太慢了|
 | 最佳|`O((n+q) log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 在初始数组上构建线段树。 每个节点存储其区间内的期望值的总和。 最初，这些只是原始的勺数。 
2. 为每个线段树节点添加惰性赋值值。 如果节点有惰性值`x`，表示该节点代表的每个位置当前都有期望值`x`。 我们使用`None`表示没有待处理的统一分配。 
3.为了`shuffle l r`，先查询区间的总和`[l,r]`。 令这个总和为`S`，并令区间长度为`len = r-l+1`。 随机排列后的期望值为`S / len`。 
4. 将此平均值分配给整个区间`[l,r]`使用惰性传播。 对于表示完全覆盖的树节点`k`位置，其总和变为`average * k`，它的惰性赋值就变成了`average`。 
5. 对于`get i`，通过线段树下降到叶子代表位置`i`。 每当节点有待处理的延迟分配时，都会在下降之前将其传播到其子节点。 然后，叶子包含所请求的确切期望值。 
6. 用足够的小数位打印每个答案。 打印小数点后十二位数字足以满足要求`1e-9`绝对或相对误差。 

### 为什么它有效

 不变量是每个线段树节点存储其区间内所有位置的期望值的精确总和，而惰性赋值记录该区间内的每个位置具有相同的期望值。 

考虑洗牌`[l,r]`。 在shuffle之前，让position处的期望值`j`是`E_j`。 每个排列都赋予区间中的每个原始位置出现在任何目标位置的相同概率。 因此，每个目标位置的新期望值为

 [
 \frac{\sum_{j=l}^{r} E_j}{r-l+1}。 
]

 线段树精确地计算这个总和，然后精确地将这个平均值分配给整个区间。 因此，每次洗牌后，不变式仍然成立。 点查询遵循影响其路径的分配并返回由叶子表示的期望值，因此每个`get`答案是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    a = list(map(float, input().split()))

    size = 4 * n + 5
    tree = [0.0] * size
    lazy = [None] * size

    def build(node, left, right):
        if left == right:
            tree[node] = a[left]
            return

        mid = (left + right) >> 1
        lc = node << 1
        rc = lc | 1

        build(lc, left, mid)
        build(rc, mid + 1, right)
        tree[node] = tree[lc] + tree[rc]

    def apply(node, left, right, value):
        tree[node] = value * (right - left + 1)
        lazy[node] = value

    def push(node, left, right):
        value = lazy[node]
        if value is None or left == right:
            return

        mid = (left + right) >> 1
        lc = node << 1
        rc = lc | 1

        apply(lc, left, mid, value)
        apply(rc, mid + 1, right, value)
        lazy[node] = None

    def range_sum(node, left, right, ql, qr):
        if ql <= left and right <= qr:
            return tree[node]

        push(node, left, right)

        mid = (left + right) >> 1
        result = 0.0

        if ql <= mid:
            result += range_sum(node << 1, left, mid, ql, qr)

        if qr > mid:
            result += range_sum(node << 1 | 1, mid + 1, right, ql, qr)

        return result

    def range_assign(node, left, right, ql, qr, value):
        if ql <= left and right <= qr:
            apply(node, left, right, value)
            return

        push(node, left, right)

        mid = (left + right) >> 1

        if ql <= mid:
            range_assign(node << 1, left, mid, ql, qr, value)

        if qr > mid:
            range_assign(node << 1 | 1, mid + 1, right, ql, qr, value)

        tree[node] = tree[node << 1] + tree[node << 1 | 1]

    def point_query(node, left, right, pos):
        if left == right:
            return tree[node]

        push(node, left, right)

        mid = (left + right) >> 1

        if pos <= mid:
            return point_query(node << 1, left, mid, pos)

        return point_query(node << 1 | 1, mid + 1, right, pos)

    build(1, 0, n - 1)

    output = []

    for _ in range(q):
        parts = input().split()

        if parts[0] == "shuffle":
            l = int(parts[1]) - 1
            r = int(parts[2]) - 1

            total = range_sum(1, 0, n - 1, l, r)
            average = total / (r - l + 1)

            range_assign(1, 0, n - 1, l, r, average)

        else:
            pos = int(parts[1]) - 1
            answer = point_query(1, 0, n - 1, pos)
            output.append(f"{answer:.12f}")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`tree`数组包含区间和。 对于叶子来说，总和就是该位置的期望值。 对于内部节点，总和是其两个子节点的总和。 

这`lazy`数组表示待处理的范围分配。 如果`lazy[node]`是`x`，该节点区间内的每个位置都有期望值`x`。 因此它的总和是`x * interval_length`。 单个赋值可以代表整个子树，这是使解决方案更快的压缩。 

这`range_sum`函数仅用于在洗牌之前获取总和。 它在概念上不会修改值，尽管它可能会向下推动惰性赋值，以便递归遍历看到正确的子总和。 

这`range_assign`函数执行随机播放的实际效果。 在完全覆盖的节点上，它根本不会访问子节点。 它更改节点的总和并延迟记录分配。 部分重叠需要首先推送父级的赋值，因为子级必须先接收父级的当前值，然后才能进一步修改其中之一。 

这`point_query`函数仅遵循一条从根到叶的路径。 它在该路径上推送惰性分配，因此叶子始终代表所请求位置的最新预期值。 

当读取查询时，所有输入索引都会从从一开始的索引转换为从零开始的索引。 间隔长度仍计算为`r - l + 1`，因为两个端点都包含在内。 

Python 整数不会有求和溢出问题，但树存储浮点期望，因为每次洗牌后都需要除法。 这些值受初始值范围的限制，因为平均值永远不会留下被平均的值的最小值和最大值。 在小数点后打印十二位数字可以提供足够的精度以满足所需的公差。 

## 工作示例

 提供的样本开头为`[1, 2, 3]`。 

| 运营| 间隔| 洗牌前的总和 | 平均分配| 术后预期值 |
 | ---| ---| ---| ---| ---|
 |`get 1`|`1`|`1`|`1`|`[1, 2, 3]`|
 |`get 3`|`3`|`3`|`3`|`[1, 2, 3]`|
 |`shuffle 1 2`|`[1,2]`|`3`|`1.5`|`[1.5, 1.5, 3]`|
 |`shuffle 2 3`|`[2,3]`|`4.5`|`2.25`|`[1.5, 2.25, 2.25]`|
 |`get 1`|`1`|`1.5`|`1.5`|`[1.5, 2.25, 2.25]`|
 |`get 3`|`3`|`2.25`|`2.25`|`[1.5, 2.25, 2.25]`|

 第一次洗牌取代了对位置的期望`1`和`2`经过`(1+2)/2 = 1.5`。 第二次洗牌必须使用`1.5`作为位置的期望`2`，所以它的平均值是`(1.5+3)/2 = 2.25`。 这说明了为什么更新必须对当前期望值而不是原始数组进行操作。 

考虑第二个例子：```
4 6
10 20 30 40
shuffle 1 4
get 1
get 4
shuffle 2 3
get 2
get 3
```| 运营| 间隔| 洗牌前的总和 | 平均分配| 术后预期值 |
 | ---| ---| ---| ---| ---|
 |`shuffle 1 4`|`[1,4]`|`100`|`25`|`[25,25,25,25]`|
 |`get 1`|`1`|`25`|`25`|`[25,25,25,25]`|
 |`get 4`|`4`|`25`|`25`|`[25,25,25,25]`|
 |`shuffle 2 3`|`[2,3]`|`50`|`25`|`[25,25,25,25]`|
 |`get 2`|`2`|`25`|`25`|`[25,25,25,25]`|
 |`get 3`|`3`|`25`|`25`|`[25,25,25,25]`|

 第一次洗牌将相同的期望分配给整个数组。 第二次shuffle没有明显的效果，因为间隔已经有了统一的期望值。 这练习了惰性分配重复覆盖树的大部分的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O((n+q) log n)`| 建造树的成本`O(n)`，并且每次洗牌都会执行一个范围总和和一个范围分配，每个`O(log n)`。 每一个`get`是一个点查询`O(log n)`。 |
 | 空间|`O(n)`| 线段树为每个树节点存储恒定量的信息，因此其大小与`n`。 |

 和`n`和`q`最多两个`250000`，该算法在每个查询中仅执行对数数量的线段树操作。 树高约为 18，因此访问节点总数仍然是可控的，这与`O(nq)`暴力模拟。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n, q = map(int, input().split())
    a = list(map(float, input().split()))

    size = 4 * n + 5
    tree = [0.0] * size
    lazy = [None] * size

    def build(node, left, right):
        if left == right:
            tree[node] = a[left]
            return

        mid = (left + right) >> 1
        lc = node << 1
        rc = lc | 1
        build(lc, left, mid)
        build(rc, mid + 1, right)
        tree[node] = tree[lc] + tree[rc]

    def apply(node, left, right, value):
        tree[node] = value * (right - left + 1)
        lazy[node] = value

    def push(node, left, right):
        value = lazy[node]
        if value is None or left == right:
            return

        mid = (left + right) >> 1
        lc = node << 1
        rc = lc | 1

        apply(lc, left, mid, value)
        apply(rc, mid + 1, right, value)
        lazy[node] = None

    def range_sum(node, left, right, ql, qr):
        if ql <= left and right <= qr:
            return tree[node]

        push(node, left, right)
        mid = (left + right) >> 1
        result = 0.0

        if ql <= mid:
            result += range_sum(node << 1, left, mid, ql, qr)

        if qr > mid:
            result += range_sum(node << 1 | 1, mid + 1, right, ql, qr)

        return result

    def range_assign(node, left, right, ql, qr, value):
        if ql <= left and right <= qr:
            apply(node, left, right, value)
            return

        push(node, left, right)
        mid = (left + right) >> 1

        if ql <= mid:
            range_assign(node << 1, left, mid, ql, qr, value)

        if qr > mid:
            range_assign(node << 1 | 1, mid + 1, right, ql, qr, value)

        tree[node] = tree[node << 1] + tree[node << 1 | 1]

    def point_query(node, left, right, pos):
        if left == right:
            return tree[node]

        push(node, left, right)
        mid = (left + right) >> 1

        if pos <= mid:
            return point_query(node << 1, left, mid, pos)

        return point_query(node << 1 | 1, mid + 1, right, pos)

    build(1, 0, n - 1)

    output = []

    for _ in range(q):
        parts = input().split()

        if parts[0] == "shuffle":
            l = int(parts[1]) - 1
            r = int(parts[2]) - 1
            total = range_sum(1, 0, n - 1, l, r)
            average = total / (r - l + 1)
            range_assign(1, 0, n - 1, l, r, average)
        else:
            pos = int(parts[1]) - 1
            output.append(f"{point_query(1, 0, n - 1, pos):.12f}")

    sys.stdout.write("\n".join(output))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def close_enough(actual: str, expected: str) -> bool:
    a = [float(x) for x in actual.split()]
    b = [float(x) for x in expected.split()]

    if len(a) != len(b):
        return False

    return all(abs(x - y) <= 1e-9 * max(1.0, abs(y)) for x, y in zip(a, b))

sample1 = """\
3 6
1 2 3
get 1
get 3
shuffle 1 2
shuffle 2 3
get 1
get 3
"""

assert close_enough(
    run(sample1),
    """\
1.000000000000
3.000000000000
1.500000000000
2.250000000000
"""
), "provided sample"

minimum = """\
1 3
7
get 1
shuffle 1 1
get 1
"""

assert close_enough(
    run(minimum),
    """\
7.000000000000
7.000000000000
"""
), "minimum size"

all_equal = """\
5 7
8 8 8 8 8
shuffle 1 5
shuffle 2 4
get 1
get 2
get 5
"""

assert close_enough(
    run(all_equal),
    """\
8.000000000000
8.000000000000
8.000000000000
"""
), "all equal values"

boundaries = """\
4 7
1 2 9 10
shuffle 1 2
get 1
get 2
shuffle 3 4
get 3
get 4
get 2
"""

assert close_enough(
    run(boundaries),
    """\
1.500000000000
1.500000000000
9.500000000000
9.500000000000
1.500000000000
"""
), "boundary intervals"

maximum_n = 250000
maximum_case = (
    f"{maximum_n} 3\n"
    + " ".join(["1000000"] * maximum_n)
    + "\n"
    + "shuffle 1 250000\n"
    + "get 125000\n"
    + "get 250000\n"
)

assert close_enough(
    run(maximum_case),
    """\
1000000.000000000000
1000000.000000000000
"""
), "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`3 6`与提供的操作|`1`,`3`,`1.5`,`2.25`| 跨重叠洗牌的正确传播 |
 |`1 3`有价值`7`|`7`,`7`| 单位置间隔和尽可能最小的数组 |
 | 整个数组和子数组洗牌的五个相等值 | 三个答案等于`8`| 统一的期望和重复的懒惰作业|
 | 带随机播放的四个值`[1,2]`和`[3,4]`|`1.5`,`1.5`,`9.5`,`9.5`,`1.5`| 包含边界和不相交区间 |
 |`n = 250000`，所有值`1000000`| 两个答案等于`1000000`| 最大数组大小和大范围赋值 |

 ## 边缘情况

 对于单位置洗牌，线段树计算区间总和并除以区间长度`1`。 和```
1 3
7
get 1
shuffle 1 1
get 1
```总和是`7`，平均值为`7 / 1 = 7`，并且范围分配使值保持不变。 两个查询都返回`7.000000000000`。 

对于全数组洗牌，每个位置都会收到相同的期望值，因为每个原始元素到达每个位置的可能性相同。 为了```
3 2
1 2 6
shuffle 1 3
get 2
```根节点已经存储了完整的和`9`。 洗牌计算`9 / 3 = 3`并分配`3`懒惰地到根。 然后，点查询将该值推入其路径并返回`3.000000000000`。 

对于包含边界，请考虑```
3 2
1 2 9
shuffle 1 2
get 2
```请求的间隔有总和`3`和长度`2`，所以它的新期望值为`1.5`。 作业恰好涵盖了职位`1`和`2`。 位置`3`遗迹`9`， 和`get 2`回报`1.500000000000`。 

对于重叠的随机播放，请考虑提供的序列```
3 4
1 2 3
shuffle 1 2
shuffle 2 3
get 1
get 3
```第一次操作后，位置`1`和`2`双方都有期待`1.5`。 第二个操作查询当前持仓总和`2`和`3`，即`1.5 + 3 = 4.5`， 不是`2 + 3 = 5`。 其新平均值为`2.25`。 最终的期望是`[1.5, 2.25, 2.25]`，所以答案是`1.500000000000`和`2.250000000000`。 

对于重复分配已经统一的间隔，请考虑```
4 3
5 5 5 5
shuffle 1 4
shuffle 2 3
get 2
```第一次随机分配`5`到每一个位置。 第二次随机计算的间隔平均值为`(5+5)/2 = 5`，所以状态不会改变。 惰性线段树处理这两个操作，而不将第一个整个数组分配扩展为单个元素。 

对于允许的最大数组，可以为每个节点分配相同的期望，而不需要具体化单独的更改。 和`250000`位置全部包含`1000000`，全频洗牌还是平均的`1000000`。 稍后的点查询仅遵循一个树路径，因此数组的大小不会将查询转变为线性扫描。
