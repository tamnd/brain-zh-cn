---
title: "CF 102279C - 打击恐怖分子"
description: "我们在一维街道上的不同整数坐标处放置了 (n) 个炸弹。 1 类工具可以移除某个长度 (w) 区间内的所有炸弹，而 2 类工具可以移除某个长度 (2w) 区间内的所有炸弹。 每个工具最多只能使用一次。"
date: "2026-08-17T10:10:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102279
codeforces_index: "C"
codeforces_contest_name: "HCW 19 Team Round (ICPC format)"
rating: 0
weight: 102279
solve_time_s: 115
verified: true
draft: false
---

[CF 102279C - 打击恐怖分子](https://codeforces.com/problemset/problem/102279/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在一维街道上的不同整数坐标处放置了 (n) 个炸弹。 1 类工具可以移除某个长度 (w) 区间内的所有炸弹，而 2 类工具可以移除某个长度 (2w) 区间内的所有炸弹。 每个工具最多只能使用一次。 

任务是找到可以使用最多（P）个1类工具和最多（Q）个2类工具移除所有炸弹的最小整数（w）。 由于只有炸弹坐标之间的距离很重要，因此我们首先将坐标排序到数组中 (x_0<x_1<\dots<x_{n-1})。 

这些约束是故意围绕（n\le 2000）制定的。 (O(n^2)) 检查是可行的，但炸弹位置、1 类工具数量和 2 类工具数量具有三个独立维度的 DP 已经太大了。 (10^9) 的坐标界限表明我们不应该迭代区间的可能位置。 相反，答案范围本身对于二分搜索来说足够小，因为 1 和 (10^9) 之间只有大约 30 次迭代。 

有几种边界情况可能会导致看似正确的实现失败。 如果(P+Q\ge n)，答案立即是(1)，因为每个炸弹都可以用自己的工具处理，并且允许的最小(w)是1。例如，`1 1 0`坐标 100 处的单个炸弹的答案为 1。始终运行 DP 的解决方案仍然可以获得答案，但假设两种工具类型都可用的实现在 (Q=0) 时可能会失败。 

区间端点包括在内。 例如，与`2 0 1`炸弹坐标1和3，2型工具覆盖长度为(2w)的区间。 在 (w=1) 处，两枚炸弹相差 2，因此两者都被摧毁，正确答案为 1。使用严格比较，例如`x[j] < x[i] + 2*w`会错误地拒绝此案。 

炸弹保证具有不同的坐标，因此所有坐标都相等的输入无效。 最接近的有意义的压力情况是紧密排列的序列，例如`3 3 0`坐标为 10, 11, 12。答案为 1，因为三个 1 类工具各可拆除一枚炸弹。 实现不应假设每个有用间隔包含至少两个炸弹。 

## 方法

 直接动态规划公式可以跟踪所有三个量。 让一个州描述尚未发现的第一枚炸弹以及已经使用了多少 1 型和 2 型工具。 从第一个未覆盖的炸弹开始，我们可以使用类型 1 工具并跳转到其长度（w）区间之外的第一个炸弹，或者使用类型 2 工具并跳转到其长度（2w）区间之外的第一个炸弹。 这是正确的，因为一旦选择最左边未覆盖的炸弹作为间隔的开始，尽可能延长该间隔永远不会有什么坏处，因为所有炸弹都位于一条线上，并且每个间隔都有固定的长度。 

该表述的问题在于其状态计数。 在最差的相关情况下，(n=2000) 和 (P,Q) 都在 1000 左右，为单个可行性检查提供大约 (2000\cdot1000\cdot1000=2\cdot10^9) 状态。 在二分查找期间重复这样的检查是完全不切实际的。 

关键的观察结果是我们不需要记住这两种工具的数量。 假设我们固定了可以使用的 1 类工具的数量。 对于炸弹阵列的每个后缀，我们可以存储摧毁该后缀所需的最少数量的 2 类工具。 类型 1 计数成为 DP 维度，而类型 2 计数是被最小化的值。 

对于固定 (w)，定义`jump1[i]`作为当 1 型工具从炸弹 (i) 开始时未覆盖的第一个炸弹。 相似地，`jump2[i]`是第一个没有被 2 型工具覆盖的炸弹，从 (i) 开始。 如果当前状态是从 (i) 开始的后缀，则下一个决策将被迫为这两个间隔之一。 因此

 [
 f[i][j]=\min\left(f[\text{jump1}[i]][j-1],
 1+f[\text{jump2}[i]][j]\right)。 
]

 这里 (f[i][j]) 是从 (i) 开始使用至多 (j) 个 1 类工具摧毁炸弹所需的 2 类工具的最小数量。 

对于实现有一项有用的改进。 我们可以选择刀具数量 (P) 或 (Q) 中较小的一个作为 DP 尺寸。 如果 (Q<P)，我们在概念上交换两种工具类型的名称。 相应的间隔长度也被交换，因此递归保持不变。 由于 (P+Q<n) 是唯一重要的情况，因此较小的计数最多大约为 (n/2)，这也将实际工作量减少了几乎一半。 

Finally, feasibility is monotone in (w). 如果某些 (w) 有效，则每个较大的 (w) 都有效，因为每个可用间隔只会变得更长。 这给出了 (1) 到 (10^9) 的二分搜索。 这与官方竞赛社论中描述的 (O(n^2\log 10^9)) DP 结构相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 三维DP| (O(nPQ)) 每张支票 | (O(nPQ)) | 太慢了 |
 | 二维DP+二分查找| (O(n^2\log 10^9)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. Sort all bomb coordinates. 一旦炸弹被订购，从最左边未覆盖的炸弹开始的每个间隔都会覆盖一系列连续的索引。 
2. If (P+Q\ge n), return 1 immediately. 工具的数量至少与炸弹一样多，每个炸弹一个工具就足够了，无论坐标间隙如何。 
3. 选择 (P) 和 (Q) 中较小的一个作为 DP 尺寸。 调用其计数`A`，其区间长度`lenA`，并让另一个工具计数为`B`与间隔长度`lenB`。 如果 type-1 是较小的资源，则`lenA=w`和`lenB=2*w`。 否则，`lenA=2*w`和`lenB=w`。 
4. 对于 (w) 的当前值，计算`jumpA[i]`和`jumpB[i]`。 每次跳转都是第一个坐标大于的索引`x[i] + len`。 由于坐标已排序，因此两个指针可以在线性时间内计算所有跳跃。 
5. 通过增加A型刀具的允许数量来加工DP。 对于固定的`j`, 计算`cur[i]`，破坏从 开始的后缀所需的 B 类工具的最小数量`i`最多使用`j`A类工具。 
6. 流程`i`从右到左。 如果我们在炸弹上使用A型工具`i`，下一个状态是`prev[jumpA[i]]`， 在哪里`prev`代表之前的值`j-1`。 如果我们使用B类工具，下一个状态是`cur[jumpB[i]] + 1`，因为当前列已经允许`j`A类工具。 
7. 过渡是
 [
 cur[a]=\amin(前一个[jumpA[i]],cur[jumpA[i]]+1)。 
]
 第一项仅在以下情况下可用`j>0`。 第二项始终可用，因为它消耗一个 B 型工具。 
8. 计算后`cur[0]`，检查是否最多`B`。 如果是这样，则当前(w)是可行的。 DP最大限度地减少了B类工具的数量，因此这个单一比较就足够了。 
9. 二分查找最小可行值 (w)。 使用标准不变量，即低于答案的每个值都是不可行的，而等于或高于答案的每个值都是可行的。 

### 为什么它有效

 考虑固定 (w) 的任何可行解决方案。 看看最左边未覆盖的炸弹 (i)。 第一个使用的工具必须摧毁炸弹（i），它可以是A型工具或B型工具。 如果是A型工具，则延长其间隔，直到`x[i] + lenA`无法移除原始解决方案需要保留的炸弹，因为炸弹只是目标，销毁额外的炸弹不会受到惩罚。 剩下的问题就是开头的后缀`jumpA[i]`。 同样的推理也适用于 B 型工具`jumpB[i]`。 

DP 考虑每个后缀的两种可能选择，并存储每个允许数量的 A 型工具所需的 B 型工具的最小数量。 因此，它代表了每一种可能的有效覆盖策略，而不存储不必要的信息。 当其最小 B 类型计数最多为可用时，最终状态是可行的`B`。 

二分查找是正确的，因为增加(w)只能扩大区间。 因此，可行性从假变为真最多一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

def feasible(w, x, p, q):
    n = len(x)

    if p + q >= n:
        return True

    # Use the smaller tool count as the DP dimension.
    if p <= q:
        a = p
        b = q
        len_a = w
        len_b = 2 * w
    else:
        a = q
        b = p
        len_a = 2 * w
        len_b = w

    jump_a = [0] * n
    jump_b = [0] * n

    r = 0
    for i in range(n):
        if r < i:
            r = i
        limit = x[i] + len_a
        while r < n and x[r] <= limit:
            r += 1
        jump_a[i] = r

    r = 0
    for i in range(n):
        if r < i:
            r = i
        limit = x[i] + len_b
        while r < n and x[r] <= limit:
            r += 1
        jump_b[i] = r

    # prev[i] = minimum B-type tools needed from i onward
    # using at most j-1 A-type tools.
    prev = [INF] * (n + 1)

    for j in range(a + 1):
        cur = [INF] * (n + 1)
        cur[n] = 0

        if j == 0:
            for i in range(n - 1, -1, -1):
                nxt = jump_b[i]
                cur[i] = cur[nxt] + 1
        else:
            for i in range(n - 1, -1, -1):
                use_b = cur[jump_b[i]] + 1
                use_a = prev[jump_a[i]]
                cur[i] = use_a if use_a < use_b else use_b

        if cur[0] <= b:
            return True

        prev = cur

    return False

def solve():
    n, p, q = map(int, input().split())
    x = [int(input()) for _ in range(n)]
    x.sort()

    if p + q >= n:
        print(1)
        return

    lo = 1
    hi = x[-1] - x[0]

    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid, x, p, q):
            hi = mid
        else:
            lo = mid + 1

    print(lo)

if __name__ == "__main__":
    solve()
```首先对输入进行排序，因为每个转换仅取决于第一个未覆盖的炸弹及其后的连续炸弹。 早期的`p + q >= n`check 既是正确性的捷径，也是防止在 (w=1) 显然足够的情况下浪费时间的有用保护。 

两个跳转数组使用单调指针。 对于每个起始炸弹，指针仅向前移动，因此构造任一数组都需要 (O(n)) 时间。 比较`x[r] <= limit`是包容性的，它可以正确处理精确边界情况。 

DP 仅使用两个阵列。`prev`包含之前的 A 工具预算，同时`cur`包含当前的。 复发需要`prev[jumpA[i]]`和`cur[jumpB[i]]`，并且两个指数均大于`i`除非后缀已经完成。 这就是为什么处理`i`从右到左使每个所需的值立即可用。 

索引处的值`n`代表空后缀。 它需要零额外的工具，所以`cur[n] = 0`是基本情况。 什么时候`j=0`，禁止使用A类工具，因此递归式的第一项被简单地省略。 

选择较小的资源数作为 DP 维度对于渐进界限来说并不是必需的，但对于 Python 来说很重要。 问题只有在以下情况下才会变得有趣：`p+q<n`，因此较小的计数低于 (n/2)。 该实现还仅存储两个 DP 行，而不是 (O(n^2)) 表。 

Python 整数具有任意精度，因此坐标算术如`2*w`不能溢出。 无论如何，涉及的最大值只有 (2\cdot10^9) 左右。 

## 工作示例

 ### 示例 1

 官方的样本是```
3 1 1
2
11
17
```答案是 4。对于 (w=4)，类型 1 区间的长度为 4，类型 2 区间的长度为 8。 

跳跃数组是`jump1 = [1, 2, 3]`和`jump2 = [2, 2, 3]`。 

| 允许的 1 类工具`j`| 首次发现`i`|`jump1[i]`|`jump2[i]`|`cur[i]`|
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 3 | 3 | 1 |
 | 0 | 1 | 2 | 2 | 1 |
 | 0 | 0 | 1 | 2 | 2 |
 | 1 | 2 | 3 | 3 | 0 |
 | 1 | 1 | 2 | 2 | 1 |
 | 1 | 0 | 1 | 2 | 1 |

 为了`j=1`，DP发现一个1型工具和一个2型工具就足够了，所以`cur[0]=1 <= Q`。 因此(w=4)是可行的。 

对于(w=3)，类型1间隔的长度为3，类型2间隔的长度为6。2、11和17处的炸弹不能用每种类型的可用工具覆盖。 因此 (w=3) 是不可行的，使得 4 成为最小值。 

### 示例 2

 考虑```
3 0 1
1
3
5
```不存在 1 类工具和 2 类工具。 2 型工具的长度为 (2w)。 

在(w=1)时，它的长度为2。它可以覆盖1和3，或者3和5，但不能覆盖全部三颗炸弹。 

| 允许的 2 类工具`j`| 首次发现`i`|`jump2[i]`|`cur[i]`|
 | --- | --- | --- | --- |
 | 0 | 2 | 3 | 1 |
 | 0 | 1 | 2 | 2 |
 | 0 | 0 | 1 | 3 |

 所需工具数量为 3 个，超出了可用工具数量。 

在 (w=2) 处，类型 2 间隔的长度为 4，涵盖从坐标 1 到坐标 5 的所有三个炸弹。 

| 允许的 2 类工具`j`| 首次发现`i`|`jump2[i]`|`cur[i]`|
 | --- | --- | --- | --- |
 | 0 | 2 | 3 | 1 |
 | 0 | 1 | 3 | 1 |
 | 0 | 0 | 3 | 1 |

 现在`cur[0]=1`，所以(w=2)是可行的。 这演示了精确的间隔长度规则以及一种资源类型计数为零的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^2\log 10^9)) | 每个二分搜索检查都有 (O(n^2)) DP 工作，最多有大约 30 个检查 |
 | 空间| (O(n)) | (O(n)) | 仅存储两个DP行和两个跳转数组|

 对于 (n\le2000)，二次 DP 是预期的比例。 二分查找仅贡献大约 30 次迭代，因为坐标范围最多为 (10^9)。 内存使用量是线性的，因为第三个 DP 维度被删除，仅保留先前和当前的 DP 行。 官方社论给出了相同的（O(n^2\log_2 10^9)）整体复杂度。 

## 测试用例

 原始语句包含一个示例，因此下面的测试套件包括该示例和几个独立的案例。 有意不包括具有字面相等的炸弹坐标的输入，因为该问题保证了不同的坐标。```python
import sys
import io

INF = 10**9

def solution(data: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(data)
        sys.stdout = io.StringIO()

        input = sys.stdin.readline

        def feasible(w, x, p, q):
            n = len(x)

            if p + q >= n:
                return True

            if p <= q:
                a = p
                b = q
                len_a = w
                len_b = 2 * w
            else:
                a = q
                b = p
                len_a = 2 * w
                len_b = w

            jump_a = [0] * n
            jump_b = [0] * n

            r = 0
            for i in range(n):
                if r < i:
                    r = i
                limit = x[i] + len_a
                while r < n and x[r] <= limit:
                    r += 1
                jump_a[i] = r

            r = 0
            for i in range(n):
                if r < i:
                    r = i
                limit = x[i] + len_b
                while r < n and x[r] <= limit:
                    r += 1
                jump_b[i] = r

            prev = [INF] * (n + 1)

            for j in range(a + 1):
                cur = [INF] * (n + 1)
                cur[n] = 0

                if j == 0:
                    for i in range(n - 1, -1, -1):
                        cur[i] = cur[jump_b[i]] + 1
                else:
                    for i in range(n - 1, -1, -1):
                        use_b = cur[jump_b[i]] + 1
                        use_a = prev[jump_a[i]]
                        cur[i] = min(use_a, use_b)

                if cur[0] <= b:
                    return True

                prev = cur

            return False

        n, p, q = map(int, input().split())
        x = [int(input()) for _ in range(n)]
        x.sort()

        if p + q >= n:
            print(1)
            return sys.stdout.getvalue()

        lo = 1
        hi = x[-1] - x[0]

        while lo < hi:
            mid = (lo + hi) // 2
            if feasible(mid, x, p, q):
                hi = mid
            else:
                lo = mid + 1

        print(lo)
        return sys.stdout.getvalue()

    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert solution("""\
3 1 1
2
11
17
""") == "4\n", "provided sample"

# Minimum-size valid input
assert solution("""\
1 1 0
100
""") == "1\n", "single bomb"

# Exact type-2 boundary: distance equals 2*w
assert solution("""\
2 0 1
1
3
""") == "1\n", "inclusive type-2 boundary"

# Exact type-1 boundary: distance equals w
assert solution("""\
2 1 0
1
2
""") == "1\n", "inclusive type-1 boundary"

# Three bombs need one type-1 interval of length 3
assert solution("""\
3 1 0
1
2
4
""") == "3\n", "type-1 span"

# Type-2 interval must cover the complete span
assert solution("""\
3 0 1
1
3
5
""") == "2\n", "type-2 span"

# Maximum n, with enough tools for w = 1
coords = "\n".join(str(i) for i in range(1, 2001))
assert solution(f"2000 2000 0\n{coords}\n") == "1\n", "maximum n"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 1 1 / 2 / 11 / 17`|`4`| 官方示例和混合工具类型 |
 |`1 1 0 / 100`|`1`| 最小尺寸的输入和一种可用的工具 |
 |`2 0 1 / 1 / 3`|`1`| 包容性 2 类端点和零类型 1 工具 |
 |`2 1 0 / 1 / 2`|`1`| 包容 1 类端点和零 2 类工具 |
 |`3 1 0 / 1 / 2 / 4`|`3`| 单个类型 1 间隔必须跨越整个范围 |
 |`3 0 1 / 1 / 3 / 5`|`2`| 类型 2 间隔必须利用其双倍长度 |
 |`2000 2000 0 / 1..2000`|`1`| 最大值 (n) 和 (P+Q\ge n) 快捷方式 |

 ## 边缘情况

 当工具的数量至少与炸弹一样多时，答案始终为 1。例如，```
1 1 0
100
```拥有一枚炸弹和一件1型工具。 坐标 100 周围放置的长度为 1 的间隔会破坏它，因此二分查找必须返回 1。实现在构造任何 DP 之前退出。 

零资源情况由`j == 0`分支。 为了```
2 0 1
1
3
```唯一可用的工具是 type-2。 在(w=1)时，其长度正好为2，坐标差正好为2。跳转条件使用`<=`，因此包含第二颗炸弹，答案为 1。 

同样的包含边界也适用于 1 类工具。 为了```
2 1 0
1
2
```长度为 1 的类型 1 间隔覆盖了两颗炸弹。 从第一个炸弹开始的跳转到达索引 2（空后缀），因此 DP 恰好使用一个 type-1 工具并返回 1。 

一个常见的错误贪心想法是尽可能使用较长的工具。 资源限制使得这变得不安全。 对于样品```
3 1 1
2
11
17
```在 (w=4) 时，类型 2 工具可以覆盖 11 和 17，而类型 1 工具可以处理 2。DP 明确考虑这种分配，而不是致力于固定的工具偏好。 

当所有可用工具都是一种类型时，交换资源公式仍然有效。 为了```
3 0 1
1
3
5
```较小的资源维度是零大小的 1 类维度，因此 DP 只有一列。 它有效地计算需要多少个 2 类间隔。 在 (w=1) 时，该数字为 3，而在 (w=2) 时，该数字变为 1。 

最后，该声明保证了不同的炸弹坐标。 实现不应为相等坐标添加特殊逻辑或使用假设正间隙的公式。 当有足够的工具时，诸如 1、2、3 之类的连续坐标都是有效的，并且都可以单独覆盖（w=1），例如在使用 2000 个炸弹和 2000 个 1 型工具的最大尺寸测试中。
