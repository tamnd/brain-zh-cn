---
title: "CF 102399F - 异或\u0448\u0438\u0444\u0440\u043e\u0432\u0430\u043d\u0438\u0435"
description: "我们维护一个由不同整数组成的动态集合 (A)，最初为空。 每次插入或删除后，我们必须确定在选择某个 XOR 掩码 (x) 和 (0 le x le k) 后 MEX 可以变得多小。"
date: "2026-08-10T17:12:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102399
codeforces_index: "F"
codeforces_contest_name: "2019 \u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u043b\u0438\u0433\u0430 A"
rating: 0
weight: 102399
solve_time_s: 762
verified: true
draft: false
---

[CF 102399F - 异或\u0448\u0438\u0444\u0440\u043e\u0432\u0430\u043d\u0438\u0435](https://codeforces.com/problemset/problem/102399/F)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个由不同整数组成的动态集合 (A)，最初为空。 每次插入或删除后，我们必须确定在选择某个 XOR 掩码 (x) 与 (0 \le x \le k) 后 MEX 可以变得多小。 

对于固定掩码 (x)，通过将每个 (a\in A) 替换为 (a\oplus x) 来获得传输集。 它的 MEX 是 (y\notin{a\oplus x\in A}) 的最小非负整数 (y)。 我们需要这个 MEX 超过每个允许的 (x) 的最小值。 

所有值都适合 20 位，因此 (A) 中可能出现的值只有 (2^{20}=1,048,576) 个。 更新数量要大得多，高达（200,000）。 这使得在每次更新后扫描整个值域的解决方案变得不可能。 即使 (O(2^{20}q)) 也需要 (2.1\cdot10^{11}) 次运算，远远超出了两秒竞赛解决方案所能承受的范围。 我们需要依赖于固定（20）位宇宙的预处理，而每次更新应该最多花费对数时间。 

有几种边界情况很容易处理不当。 空集就是其中之一。 例如，```
1 0
1 5
```有输出```
0
```因为变换后的集合仍然是空的，其 MEX 为 (0)。 假设存在某些转换值的解决方案会出错。 

另一个重要的情况是从 (0) 到 (k) 的每个值都已在 (A) 中。 例如，```
3 2
1 0
1 1
1 2
```有输出```
0
0
1
```第三次更新后，每个允许的 XOR 掩码都是 (0,1,2)，因此它们都不能立即使 (0) 消失。 答案变为(1)。 粗心的实现仅检查 (0) 本身是否不存在于 (A) 中，从而错过了异或运算的效果。 

XOR 范围的上限也很重要。 如果 (k=2^{20}-1)，则每个可能的 20 位值都是允许的掩码。 由于最多存在 (200,000) 个值，而有 (2^{20}) 个可能值，因此缺少某些值 (z)，我们可以选择 (x=z)。 那么 (z\oplus x=0)，所以答案总是 (0)。 忘记允许 (x=k) 会在此处产生差一错误。 

最后，(A) 中的值不必接近零。 例如，```
1 2
1 7
```有输出```
0
```因为 (0) 丢失并且选择 (x=0) 已经给出了 MEX (0)。 仅搜索当前存储的值的解决方案是不必要的，并且可能会变得不正确。 

## 方法

 直接的方法是尝试每个允许的掩码 (x)。 对于每个 (x)，我们可以构造或概念性地检查变换后的集合并找到其 MEX。 如果 (|A|=n)，其 MEX 至多为 (n)，因此简单的实现可以测试 (0,1,\ldots,n) 的成员资格。 在最坏的情况下，每次更新的成本为 (O((k+1)n))。 当 (q=200,000)、(k) 接近 (2^{20})、(n) 接近 (200,000) 时，最坏情况大致为

 [
 200,000\cdot1,048,576\cdot200,000
 \约4.2\cdot10^{16}
 ]

 会员资格检查。 即使用更快的数据结构替换 MEX 计算也无法保存该方法，因为每次更新后尝试所有 (2^{20}) 掩码已经太昂贵了。 

关键的观察是不要再将 MEX 视为必须为每个掩码单独计算的东西。 

修复遮罩 (x)。 它的 MEX 是最小的 (y)，使得 (y) 不属于变换后的集合。 条件 (y\notin{a\oplus x\in A}) 等价于

 [
 y\o加 x\notin A.
 ]

 让

 [
 z=y\o加x。 
]

 那么 (z) 只是 (A) 中缺少的某个值，并且

 [
 y=x\o 加 z。 
]

 因此，

 \min_{z\notin A}(x\oplus z)。 
]

 取允许的最佳值 (x)，

 \min_{z\notin A}\min_{0\le x\le k}(x\oplus z)。 
]

 这彻底改变了问题。 对于每个可能的值 (z)，定义静态函数

 [
 g(z)=\min_{0\le x\le k}(x\oplus z)。 
]

 那么答案很简单

 [
 \boxed{\min_{z\notin A}g(z)}。 
]

 集合 (A) 是动态的，但 (g) 仅取决于 (k)。 我们可以预处理值 (g(z))，计算每个可能的当前缺失值 (g) 有多少个，并维护最小的非空桶。 

还有一个更有用的界限。 如果(A)当前包含(n)个值，则每个变换集也包含(n)个值，因此其MEX至多为(n)。 因此最终的答案最多是 (n\le q)。 我们永远不需要维护 (g(z)>q) 的桶。 

剩下的任务是快速计算 (g(z))。 这可以使用 (z) 和 (k) 的二进制表示在恒定时间内完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(q^2 2^{20})) 最坏情况 | (O(q)) | 太慢了|
 | 最佳 | (O(2^{20}+q\log q)) | (O(q)) | 已接受 |

 ## 算法演练

 1. 将所需答案重写为

 [
 \min_{z\notin A}g(z),
 \qquad
 g(z)=\min_{0\le x\le k}(z\oplus x)。 
]

 这是有效的，因为对于固定 (x)，(A) 的每个缺失值 (z) 双射对应于 (A\oplus x) 的缺失值 (y=z\oplus x)。 
2. 观察每当 (z\le k) 时 (g(z)=0)，因为我们可以简单地选择 (x=z)。 

因此，所有值 (0,1,\ldots,k) 都属于同一个桶 (g=0)。 
3. 对于(z>k)，从最高有效位向下比较(z)和(k)。 在它们的最高不同位处，(z)具有(1)并且(k)具有(0)，因为(z>k)。 

允许的 (x) 不能使该位等于 (z)，因此 XOR 必须包含该位。 修复后，低位与(z)和(k)的低位部分成为相同的问题。 
4.让

 [
 d=z\o加k。 
]

 (z) 和 (k) 不同且 (k) 包含 (1) 的位恰好是

 [
 d\mathbin{&}k.
 ]

 如果最高位是（r），则贪婪过程将在那里停止，因为在该位（z）有（0）并且（k）有（1），所以所选的（x）已经变得严格小于（k）。 然后所有较低位都可以自由匹配。 

因此，如果`bad = d & k`，那么

 [
 g(z)=(d\mathbin{&}\neg k)
 \mathbin{&}
 \left(-2^{\operatorname{bit_length}(bad)}\right)。 
]

如果`bad`为零，没有这样的停止位，所以

 [
 g(z)=d\mathbin{&}\neg k.
 ]
 5. 预先计算每个 (g(z)\le q) 有多少个值 (z\in[0,2^{20}))。 (g(z)) 较大的值可以忽略，因为答案永远不会超过 (q)。 

最初，(A) 中缺少每个值 (z)，因此这些计数描述了完整的缺失集。 
6. 维护一个最小堆，其中包含从 (0) 到 (q) 的所有可能的存储桶值。 旁边，保持`cnt[v]`，当前缺失 (z) 的数量 (g(z)=v)。 

当将一个值插入 (A) 时，其存储桶会丢失一个缺失值。 当它从 (A) 中删除时，它的存储桶将获得一个缺失值。 
7. 每次更新后，删除桶计数为零的堆条目。 最小的剩余堆值恰好是

 [
 \min_{z\notin A}g(z),
 ]

 这是所需的最小可能的 MEX。 

不变的是`cnt[v]`始终等于 (A) 中当前缺少的值的数量，其与允许的掩码的最佳可能异或恰好是 (v)。 堆代表候选桶索引，而零计数桶将被延迟丢弃。 因此，堆最小值始终是所有缺失 (z) 中最小的 (g(z))，通过上面的变换，这正是原始问题的答案。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

LIMIT = 1 << 20

def solve():
    q, k = map(int, input().split())

    cnt = [0] * (q + 1)

    # Every z in [0, k] has g(z) = 0.
    cnt[0] = k + 1

    not_k = ~k

    # For z > k, compute g(z) in O(1).
    for z in range(k + 1, LIMIT):
        d = z ^ k
        bad = d & k

        g = d & not_k

        if bad:
            # Keep only bits strictly above the highest bit of bad.
            g &= -(1 << bad.bit_length())

        if g <= q:
            cnt[g] += 1

    # Initially every bucket is a candidate.
    heap = list(range(q + 1))
    heapq.heapify(heap)

    # True means that this bucket currently has an entry in the heap.
    in_heap = [True] * (q + 1)

    def get_g(z):
        if z <= k:
            return 0

        d = z ^ k
        bad = d & k

        g = d & not_k

        if bad:
            g &= -(1 << bad.bit_length())

        return g

    ans = []

    for _ in range(q):
        typ, z = map(int, input().split())
        g = get_g(z)

        if g <= q:
            if typ == 1:
                # z becomes present, so it is no longer missing.
                cnt[g] -= 1
            else:
                # z becomes missing again.
                if cnt[g] == 0 and not in_heap[g]:
                    heapq.heappush(heap, g)
                    in_heap[g] = True
                cnt[g] += 1

        while cnt[heap[0]] == 0:
            v = heapq.heappop(heap)
            in_heap[v] = False

        ans.append(str(heap[0]))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```预处理开始于`cnt[0] = k + 1`，因为从 (0) 到 (k) 的每个值与允许的间隔的异或距离为零。 只有大于 (k) 的值才需要按位公式。 

对于这样的价值，`d = z ^ k`准确记录两个数字不同的位置。 表达式`d & ~k`保留 (k) 为零的不同位置，这些位置必然有助于最小 XOR。 如果`bad = d & k`为非零时，其最高设置位标识第一个较低位置，其中 (z) 为零且 (k) 为 1。 表达式`-(1 << bad.bit_length())`清除该位置以下的所有位。 

更新本身只需要计算一次 (g(z))。 插入会减少其存储桶，因为值不再丢失。 删除会增加其存储桶，因为该值再次丢失。 

堆是懒惰的。 当桶的计数变为零时，桶不会立即被删除。 相反，清理循环仅在零计数桶到达顶部时才删除它们。 这`in_heap`当存储桶再次变为非空时，数组可防止不必要的重复堆条目。 

所有算术都是整数。 Python 整数在这里不存在溢出问题，并且所有相关值都适合在 20 位域内。 

## 工作示例

 对于样品 1，(k=2)。 (g) 的相关值为

 [
 g(0)=g(1)=g(2)=0,
 \四边形
 g(3)=1,
 \四边形
 g(4)=g(5)=g(6)=4,
 \四边形
 g(7)=5。 
]

 踪迹是：

 | 步骤| 运营| 改变值 | (g(z)) | (g(z)) | 缺失计数 (g=0) | 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 添加 1 | 1 | 0 | 2 | 0 |
 | 2 | 添加 0 | 0 | 0 | 1 | 0 |
 | 3 | 添加 2 | 2 | 0 | 0 | 1 |
 | 4 | 删除 1 | 1 | 0 | 1 | 0 |
 | 5 | 添加 3 | 3 | 1 | 0 | 0 |
 | 6 | 添加 1 | 1 | 0 | 0 | 4 |
 | 7 | 添加 4 | 4 | 4 | 0 | 4 |
 | 8 | 删除 3 | 3 | 1 | 0 | 1 |

 第三个操作是所有值 (0,1,2) 都存在的第一个点。 零存储桶变空，因此堆前进到 (g=1)，对应于缺失值 (3)。 在第六次操作时，再次插入值(1)，因此缺失值不再包含任何(g=0)或(g=1)的元素。 下一个可用桶是(g=4)。 

对于样品 2，(k=1)。 这里(g(0)=g(1)=0)，而(g(2)=g(3)=2)。 

| 步骤| 运营| 改变值 | (g(z)) | (g(z)) | 缺失计数 (g=0) | 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 添加 2 | 2 | 2 | 2 | 0 |
 | 2 | 添加 1 | 1 | 0 | 1 | 0 |
 | 3 | 添加 3 | 3 | 2 | 1 | 0 |
 | 4 | 删除 2 | 2 | 2 | 1 | 0 |
 | 5 | 添加 0 | 0 | 0 | 0 | 2 |

 最后的操作填充允许区间中的最后一个缺失值，即（0）。 剩余的最小桶是 (g=2)，由缺失值 (2) 产生，给出最终答案 (2)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(2^{20}+q\log q)) | 每个可能的 20 位值在预处理期间都会处理一次，并且每次更新都会执行一次堆操作以及惰性清理。 |
 | 空间| (O(q)) | 桶计数、堆和辅助堆状态数组都有大小 (O(q))。 |

 固定值域仅包含(1,048,576)个数字，因此预处理是实用的。 动态部分每次更新仅执行 (O(\log q)) 堆工作，大约提供 (200,000\log_2 200,000) 堆级别操作。 该算法永远不会在整个 (2^{20}) 域上构造 trie 树或线段树，这使得 Python 内存使用量很小。 

## 测试用例```python
import io
import sys
import heapq

LIMIT = 1 << 20

def run(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    q = int(next(it))
    k = int(next(it))

    cnt = [0] * (q + 1)
    cnt[0] = k + 1

    not_k = ~k

    for z in range(k + 1, LIMIT):
        d = z ^ k
        bad = d & k
        g = d & not_k

        if bad:
            g &= -(1 << bad.bit_length())

        if g <= q:
            cnt[g] += 1

    heap = list(range(q + 1))
    heapq.heapify(heap)
    in_heap = [True] * (q + 1)

    def get_g(z):
        if z <= k:
            return 0

        d = z ^ k
        bad = d & k
        g = d & not_k

        if bad:
            g &= -(1 << bad.bit_length())

        return g

    out = []

    for _ in range(q):
        typ = int(next(it))
        z = int(next(it))
        g = get_g(z)

        if g <= q:
            if typ == 1:
                cnt[g] -= 1
            else:
                if cnt[g] == 0 and not in_heap[g]:
                    heapq.heappush(heap, g)
                    in_heap[g] = True
                cnt[g] += 1

        while cnt[heap[0]] == 0:
            v = heapq.heappop(heap)
            in_heap[v] = False

        out.append(str(heap[0]))

    return "\n".join(out)

# Provided sample 1
assert run(
    """8 2
1 1
1 0
1 2
2 1
1 3
1 1
1 4
2 3
"""
) == """0
0
1
0
0
4
4
1""", "sample 1"

# Provided sample 2
assert run(
    """5 1
1 2
1 1
1 3
2 2
1 0
"""
) == """0
0
0
0
2""", "sample 2"

# Minimum-size case.
assert run(
    """1 0
1 0
"""
) == """1""", "minimum case"

# Boundary case: every 20-bit value is an allowed XOR mask.
# With only two stored values, many values remain missing, so the answer is 0.
assert run(
    """2 1048575
1 0
1 1048575
"""
) == """0
0""", "maximum k"

# Off-by-one case around k.
assert run(
    """3 2
1 0
1 1
1 2
"""
) == """0
0
1""", "complete allowed interval"

# Repeated insertion and deletion of the same value.
assert run(
    """4 0
1 1
2 1
1 1
2 1
"""
) == """0
0
0
0""", "toggle same value"

# Maximum number of updates, alternating the same value.
# The answer is always 0 because k = 0 and value 0 is never inserted.
q = 200000
parts = [f"{q} 0"]
for i in range(q):
    parts.append("1 1" if i % 2 == 0 else "2 1")

large_input = "\n".join(parts) + "\n"
large_output = run(large_input).split()

assert len(large_output) == q, "maximum q length"
assert all(x == "0" for x in large_output), "maximum q values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`， 添加`0`|`1`| 尽可能最小的输入和第一个肯定的答案 |
 |`k = 1048575`，添加两个值 |`0`,`0`| 最大掩模边界|
 | 添加`0,1,2`和`k=2`|`0,0,1`| 当整个允许的间隔出现时精确转换 |
 | 切换`1`反复与`k=0`|`0,0,0,0`| 正确插入和删除相同的值 |
 | (q=200000)，交替`1`和`2`论价值`1`| 200000 个零 | 最大更新计数和惰性堆行为 |

 ## 边缘情况

 当 (A) 为空时，所有值都会丢失。 特别是，值 (0) 到 (k) 缺失，因此它们的存储桶为 (g=0)。 堆立即报告 (0)，与空转换集的 MEX 为 (0) 的事实相匹配。 

为了```
1 0
1 0
```唯一允许的掩码是 (x=0)，变换后的集合是 ({0})，所以答案是 (1)。 该算法从存储桶中缺少一个值 (g=0) 开始，然后插入 (0) 使该存储桶为空。 下一个缺失值是 (g=1)，因此堆报告 (1)。 

为了```
3 2
1 0
1 1
1 2
```初始零桶包含(0,1,2)。 每次插入都会从缺失集中删除这些值之一。 第三次插入后，其计数为零。 剩余的最小桶是(g(3)=1)，所以输出是(1)。 

对于最大掩模边界，```
2 1048575
1 0
1 1048575
```允许的掩码覆盖整个 20 位宇宙。 仍然有许多缺失值，任何缺失的 (z) 本身都是允许的掩码。 选择 (x=z) 给出 (z\oplus z=0)，因此 (g(z)=0)。 因此，桶 (0) 保持非空状态，答案保持 (0)。 

(x\le k) 和 (x<k) 之间的相差一区别由条件处理`z <= k`。 如果(z=k)，选择(x=k)给出XOR(0)，所以(g(k)=0)。 排除 (k) 会错误地将该值移动到正值桶中。 

(z>k) 的公式还可以处理第一个强制 XOR 位不是唯一贡献位的情况。 对于(k=2)和(z=7)，二进制表示是(010)和(111)。 最小值是 (7\oplus2=5)，而不是 (4)。 这里`d = 5`,`bad = 0`，因此公式保留两个贡献位并得到(g(7)=5)。 对于 (z=5)，我们有`d = 7`和`bad = 2`，其最高位为停止位。 较低的贡献被清除，给出(g(5)=4)。 这些情况正是为什么仅使用最高的不同位是不正确的。
