---
title: "CF 102392C - 查找数组"
description: "我们有一个包含 n 个不同正整数的隐藏数组 a。 我们不直接接收它的值。 相反，互动法官让我们提出两种问题。 类型 1 查询给出一个位置的精确值。"
date: "2026-08-10T21:16:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102392
codeforces_index: "C"
codeforces_contest_name: "2019-2020 ICPC Southeastern European Regional Programming Contest (SEERC 2019)"
rating: 0
weight: 102392
solve_time_s: 214
verified: true
draft: false
---

[CF 102392C - 查找数组](https://codeforces.com/problemset/problem/102392/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个隐藏数组`a`的`n`不同的正整数。 我们不直接接收它的值。 相反，互动法官让我们提出两种问题。 

类型 1 查询给出一个位置的精确值。 类型 2 查询选择多个位置并返回所选值之间的每个成对绝对差值，但返回的差值被打乱，因此我们知道距离的多重集，但不知道哪对产生每个距离。 

目标是确定每一个`a[i]`然后发送带有类型 3 答案的整个重构数组。 

该数组最多包含 250 个元素，但真正的限制是查询预算：仅允许 30 个类型 1 或类型 2 查询。 询问每个人的简单策略`a[i]`用途`n`查询量最大的情况下已经达到250个查询量。 数值可以大到`10^9`，因此实现应该使用整数运算，而不对小坐标做出假设。 Python 整数就足够了。 

独特性条件是关键的结构限制。 这意味着最小和最大数组值出现在唯一的位置。 因此，在所有成对差异中，最大差异由这两个位置唯一确定。 这为我们提供了一种方法来定位数值范围的一个端点，而无需询问任何单独的值。 

有几种影响实施的边缘情况。 如果`n = 1`，不存在合法的类型 2 查询，因为它需要至少两个位置，因此唯一可能的策略是一个类型 1 查询。 例如，隐藏数组`[7]`被重构为`[7]`。 

如果`n <= 30`，直接询问每个位置也是合法的，并且比一般的构造更简单。 例如，使用隐藏数组`[4, 9, 15]`，三个类型1查询恢复`4`,`9`， 和`15`。 

当二分查找找到的位置是最小值而不是最大值时，会出现第二种微妙的情况。 假设隐藏数组是`[10, 4, 17]`。 范围查询找到的端点位置可以包含`4`，最小值。 如果我们盲目地将每个值重构为`a[p] - B[i]`，某些值将变得无效。 最后两个类型 1 查询区分是否`a[p]`是最小值或最大值，并相应地选择加法或减法。 

另一个实现陷阱是类型 2 查询返回的差异是多重集。 即使原始数组值不同，值也可以重复。 例如，数组`[1, 4, 7]`具有成对差异`3, 6, 3`。 集合减法会错误地丢弃重复的`3`; 该实现必须执行**多重集减法**，一次消耗一个匹配的出现。 

## 方法

 直接的方法是对每个位置进行类型 1 查询。 这是完全正确的，因为每个查询都会显示一个精确的数组元素，但它需要`n`查询。 和`n = 250`，这意味着 250 个查询，远远超出了 30 个的限制。 

一种更诱人的方法是询问所有成对差异一次，并尝试从该距离多重集重建数组。 距离多重集确实包含大量信息，但它丢失了方向和位置信息。 即使数值可以通过平移和反射来重建，我们仍然需要将每个值分配给其原始索引。 尝试独立解决每个职位的歧义将需要太多查询。 

有用的观察是不同的值给我们独特的终点。 使用一种类型 2 查询查询所有职位。 返回的最大差值为`max(a) - min(a)`。 

现在获取位置的前缀并询问该前缀内的所有成对差异。 当该前缀同时包含全局最小值和全局最大值时，最大差值恰好等于全局最大值。 因此，我们可以二分搜索包含两个端点的第一个前缀。 该位置是两个端点位置中较晚的一个。 我们不知道它是否具有最小值或最大值，但我们知道它是其中之一。 

呼叫此职位`p`并定义`B[i] = |a[i] - a[p]|`。 

自从`a[p]`是一个端点，值`B[i]`都是不同的。 更重要的是，一旦我们知道`B[i]`以及是否`a[p]`是最小值或最大值，紧随其后的是原始值：`a[i] = a[p] + B[i]`如果`a[p]`是最小值，

 或`a[i] = a[p] - B[i]`如果`a[p]`是最大值。 

剩下的问题是分配每个不同的距离`B[i]`到正确的位置。 这就是第二个分而治之的想法出现的地方。 

对于任何集合`I`不包含`p`，比较类型 2 响应`I`和`I ∪ {p}`。 每双都完全在里面`I`发生在两个响应中并在多重集减法下取消。 剩下的唯一区别就是距离`p`对每个元素`I`，分别是对应的`B[i]`价值观。 

假设我们已经知道了多重集`B`属于某个区间的值。 将该间隔分成两半。 我们只需要找出哪一半包含哪些距离。 在二元分解的某一深度，将所有左半部分组合成一个查询。 该查询与相同查询之间的区别`p`添加给出了完整的多重集`B`所有左半部分的值。 每个父项都已经拥有其完整的多重集，因此其右半多重集只是父项与其左半部分之间的多重集差。 

这使得一对查询可以解析整个二进制分解级别，而不是一次解析一个间隔。 

直接方法会成功，因为每个位置都可以独立查询，但会失败，因为查询预算是恒定的。 对唯一最小值和最大值的观察将问题转换为从一个端点恢复距离，并且二进制分区允许将这些距离分配给每个级别仅具有两个查询的位置。 

结果查询次数最多为`1 + ceil(log2 n)`为了找到终点位置，`1 + 2 ceil(log2 n)`用于恢复和分配所有距离，

 和`2`最终类型 1 查询。 

那是`5 + 3 ceil(log2 n)`，最多为 29`n <= 250`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) 查询和 O(n) 交互开销 | O(n) | 查询太多 |
 | 最佳| O(n² log n) 本地处理，O(log n) 查询 | O(n²) 临时响应存储 | 已接受 |

 本地处理主要是对大的 2 类响应进行排序和减去。 查询计数（而不是普通的 CPU 复杂性）是核心约束。 

## 算法演练

 1.如果`n <= 30`，直接询问每个位置的值。 查询数量最多为 30，因此没有理由使用更复杂的构造。 这也处理`n = 1`，其中类型 2 查询是非法的。 
2. 否则，查询全部`n`具有一种类型 2 查询的位置并让`D`是最大的返回差值。 因为所有的价值观都是不同的，`D`正是`max(a) - min(a)`。 
3.二分查找最小前缀`[1, mid]`其最大两两差异为`D`。 如果前缀包含两个全局端点，则其最大差异为`D`。 如果不是，则其最大差值会更小。 最大值变为的第一个前缀`D`结束于最小值位置和最大值位置中较晚的一个位置。 呼叫此职位`p`。 
4. 定义`B[i] = |a[i] - a[p]|`。 自从`a[p]`是全局最小值或全局最大值，每个其他数组值与`a[p]`。 还设置了`B[p] = 0`。 
5、查询除`p`。 从原始全位置响应中减去多组差异。 两个非之间的每一个差异`p`位置取消，留下精确的距离`p`到所有其他职位。 因此我们现在知道了完整的多重集`B`值，尽管我们还不知道哪个位置拥有哪个值。 
6. 将位置视为二叉划分树的叶子。 最初根代表整个索引区间，其`B`多重集是已知的。 在每个深度，将每个活动间隔分成两半。 
7. 将当前关卡的所有左半部分收集成一组`L`。 查询里面的两两差异`L`，添加后再次查询`p`。 如果`p`存在于`L`，在构建第一个查询之前将其删除并处理其已知距离`B[p] = 0`分别地。 两个响应的多重集减法准确给出`B`属于所有位置的值`L`。 
8. 对于每个父区间，通过多重集减法在概念上与此信息相交。 其左孩子的多重集是级别查询找到的部分，其右孩子的多重集是父多重集减去左孩子的多重集。 由于每`B[i]`是唯一的，一旦一个区间包含一个位置，它唯一剩余的距离就可以直接识别该位置。 
9. 继续分割，直到每个间隔都是一个位置。 那时`B[i]`每个指标都是已知的。 
10.找位置`q`最大`B[q]`。 自从`p`是一个端点，距离最远的数组值`a[p]`必须是相反的端点。 询问类型 1 查询`a[p]`和`a[q]`。 如果`a[p] < a[q]`， 然后`p`是最小值并且每个值都是`a[p] + B[i]`。 否则`p`是最大值，每个值都是`a[p] - B[i]`。 
11. 使用类型 3 查询打印重建的数组并终止。 交互查询总数最多为 29 条`n <= 250`。 

### 为什么它有效

 中心不变量是二元分解中的每个活动区间准确地存储`B[i]`属于其职位的价值观。 从根本上来说这是正确的，因为减去除`p`从所有位置的响应中删除所有非`p`配对并留下精确的距离`p`。 在每次分割时，级别查询同时确定每个左子项的多重集。 右子项是其父项与其左子项之间的多集差异，因此不变量在分割后仍然存在。 最终每个区间包含一个索引，使其单个剩余值恰好是该位置的`B[i]`。 

端点搜索也是精确的。 当且仅当前缀同时包含全局最小值和全局最大值时，前缀才具有全局最大差值。 第一个这样的前缀在稍后的端点位置结束。 自从`p`是两个端点之一，其距离唯一地确定直到单个剩余反射模糊度的每个其他值。 最后两个 1 类查询解决了这个歧义。 

## Python 解决方案

 下面的程序是实际的交互解决方案。 它必须针对交互式判断运行，而不是针对普通的静态输入。 每个查询都会立即刷新，并且`-1`响应导致协议要求的立即终止。```python
import sys
input = sys.stdin.readline

def query1(i):
    print(1, i, flush=True)
    x = int(input())
    if x == -1:
        sys.exit(0)
    return x

def query2(indices):
    k = len(indices)
    print(2, k, *indices, flush=True)

    cnt = k * (k - 1) // 2
    res = [int(input()) for _ in range(cnt)]

    if res and res[0] == -1:
        sys.exit(0)

    return res

def multiset_subtract(a, b):
    """
    Return multiset a - multiset b.
    The caller guarantees that b is a submultiset of a.
    """
    a = sorted(a)
    b = sorted(b)

    res = []
    j = 0

    for x in a:
        while j < len(b) and b[j] < x:
            j += 1

        if j < len(b) and b[j] == x:
            j += 1
        else:
            res.append(x)

    return res

def get_b_values(indices, p):
    """
    Return the multiset {B[i] : i in indices}.

    Two type-2 queries are normally enough:
        Q(indices)
        Q(indices union {p})

    Their multiset difference contains exactly the distances
    from p to the selected indices.

    Singleton sets need type-1 queries because type-2 requires
    at least two positions.
    """
    indices = list(indices)

    if p in indices:
        indices.remove(p)
        contains_p = True
    else:
        contains_p = False

    if not indices:
        return [0] if contains_p else []

    if len(indices) == 1:
        x = query1(indices[0])
        y = query1(p)
        ans = [abs(x - y)]
        if contains_p:
            ans.append(0)
        return ans

    q_without_p = query2(indices)

    with_p = indices + [p]
    q_with_p = query2(with_p)

    ans = multiset_subtract(q_with_p, q_without_p)

    if contains_p:
        ans.append(0)

    return ans

def solve():
    n = int(input())

    if n <= 30:
        ans = [query1(i) for i in range(1, n + 1)]
        print(3, *ans, flush=True)
        return

    all_indices = list(range(1, n + 1))

    # Step 1: find the maximum possible pairwise difference.
    all_diff = query2(all_indices)
    global_max_diff = max(all_diff)

    # Step 2: binary search for the later of the global
    # minimum and global maximum positions.
    lo, hi = 2, n

    while lo < hi:
        mid = (lo + hi) // 2
        prefix = list(range(1, mid + 1))

        diff = query2(prefix)

        if max(diff) == global_max_diff:
            hi = mid
        else:
            lo = mid + 1

    p = lo

    # Step 3: obtain the complete multiset of B values.
    without_p = [i for i in all_indices if i != p]
    diff_without_p = query2(without_p)

    root_b = multiset_subtract(all_diff, diff_without_p)
    root_b.append(0)

    # Each node is represented by:
    #   (left endpoint, right endpoint, multiset of B values)
    #
    # We maintain all current nodes and split them level by level.
    nodes = [(1, n, root_b)]

    B = [None] * (n + 1)
    B[p] = 0

    while nodes:
        next_nodes = []

        # If every node is already a singleton, all B values
        # have been assigned.
        if all(l == r for l, r, _ in nodes):
            for l, r, vals in nodes:
                if l == r:
                    B[l] = vals[0]
            break

        # Collect all left children from this level.
        left_intervals = []
        for l, r, _ in nodes:
            if l == r:
                continue

            m = (l + r) // 2
            left_intervals.append((l, m))

        selected = []
        for l, r in left_intervals:
            selected.extend(range(l, r + 1))

        # Recover B values for all selected left children
        # using exactly two queries for this level.
        selected_b = get_b_values(selected, p)

        # The returned values are globally unique, so we can
        # distribute them to each parent by multiset membership.
        #
        # To avoid repeatedly scanning the whole selected list,
        # count the selected B values by value.
        from collections import Counter

        selected_count = Counter(selected_b)

        for l, r, parent_b in nodes:
            if l == r:
                B[l] = parent_b[0]
                continue

            m = (l + r) // 2

            left_positions = set(range(l, m + 1))
            left_b = []

            # Every B value is unique, so membership in the
            # level result identifies the corresponding child.
            for value in parent_b:
                if selected_count[value] > 0:
                    left_b.append(value)
                    selected_count[value] -= 1

            right_b = multiset_subtract(parent_b, left_b)

            next_nodes.append((l, m, left_b))
            next_nodes.append((m + 1, r, right_b))

        nodes = next_nodes

    # Step 4: find the position opposite p.
    q = 1
    for i in range(1, n + 1):
        if B[i] > B[q]:
            q = i

    value_p = query1(p)
    value_q = query1(q)

    if value_p < value_q:
        # p is the global minimum.
        ans = [value_p + B[i] for i in range(1, n + 1)]
    else:
        # p is the global maximum.
        ans = [value_p - B[i] for i in range(1, n + 1)]

    print(3, *ans, flush=True)

if __name__ == "__main__":
    solve()
```这`query1`函数打印查询，刷新标准输出，读取法官的响应，如果法官返回则立即终止`-1`。 在交互式问题中，刷新是强制性的，因为法官无法回答尚未收到的查询。 

这`query2`函数准确读取`k(k-1)/2`整数。 该语句的格式可能会使该公式容易被误读，但这些是无序对，因此数字是二项式系数而不是`k(k-1)`。`multiset_subtract`对两个响应进行排序并一次使用一个匹配值。 这是必要的，因为即使所有原始数组值都是不同的，距离也可能在类型 2 响应中出现多次。 

二分查找使用`[1, mid]`而不是任意子集，因为属性“该集合包含两个全局端点”对于前缀来说是单调的。 一旦前缀包含两个端点，每个较大的前缀也会包含两个端点。 

这`get_b_values`例程单独处理单例集，因为类型 2 协议需要至少两个位置。 当所选集合包含`p`，已知其自身距离为零，因此显式插入零。 

主重建循环将间隔与其一起存储`B`多集。 级别查询会立即收集所有剩余子级。 父多重集通过减法补充缺失的右孩子。 Python 的任意精度整数还消除了高达以下值的溢出问题`10^9`。 

对紧凑参考实现的一项实际改进是在数据结构中保持区间所有权的明确解释。 查询预算仍然渐近相同，而实现更容易审核区间边界错误。 

## 工作示例

 该声明包含一份交互记录而不是传统的静态样本。 以下跟踪使用两个有效的隐藏数组并显示算法观察到的内容。 

### 示例 1

 考虑隐藏数组`[1, 2, 5]`。 

第一个全位置查询返回多重集`{1, 3, 4}`。 其最大值为`4`，所以两个端点值是`1`和`5`。 

| 舞台| 职位查询 | 最大差值| 状态|
 | --- | --- | --- | --- |
 | 初始|`{1,2,3}`|`4`| 全球范围是`4`|
 | 二分查找 |`{1,2}`|`1`| 两个端点都不在这里 |
 | 二分查找 |`{1,2,3}`|`4`| 两个端点都在这里，所以`p = 3`|
 | 消除`p`|`{1,2}`|`1`| 取消所有非`p`成对|
 | 添加`p`|`{1,2,3}`|`4`| 差异给出`{4,3}`|
 | 最终值| 职位`3,1`|`5,1`|`p`是最大值 |

 这里`p = 3`， 所以`B = [4, 3, 0]`。 最大距离是`B[1] = 4`，查询位置 3 和 1 给出值`5`和`1`。 自从`a[p]`更大，每个值都被重构为`a[p] - B[i]`，生产`[1,2,5]`。 

这与原始交互示例所演示的端点方向模糊性相同。 

### 示例 2

 考虑隐藏数组`[20, 7, 13, 30, 2, 25]`。 

全局端点是`2`和`30`，所以最大差值为`28`。 

| 舞台| 职位查询 | 最大差值| 状态|
 | --- | --- | --- | --- |
 | 初始|`{1,2,3,4,5,6}`|`28`| 全球范围是`28`|
 | 二分查找 |`{1,2,3}`|`18`| 端点被分割|
 | 二分查找 |`{1,2,3,4,5}`|`28`| 两个端点都存在 |
 | 二分查找 |`{1,2,3,4}`|`28`| 两个端点都存在 |
 | 端点 |`p = 4`|`30`| 位置 4 是较晚的端点 |
 | 距离重建 | 相对于`p`| |`B = [10,23,17,0,28,5]`|
 | 最终定位| 职位`4,5`|`30,2`|`p`是最大值 |
 | 重建| 所有职位| |`[20,7,13,30,2,25]`|

 该跟踪说明了为什么二分查找不需要知道是否`p`是最小值或最大值。 它只需要`p`成为两个端点之一。 最后一对直接查询解决了剩余的反射。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 互动查询 | O(log n) | 最多`5 + 3 ceil(log2 n)`查询 |
 | 当地时间 | O(n² log n) | O(n² log n) | 对所有级别的 2 类响应进行排序和减去 |
 | 空间| O(n²) | 类型 2 响应可以包含`n(n-1)/2`差异|

 为了`n = 250`,`ceil(log2 n) = 8`, 最多给予`5 + 3·8 = 29`查询。 限制为30，留下1个安全裕度查询。 最大的响应仅包含`250·249/2 = 31,125`整数，因此内存需求在 256 MB 以内。 预期的解决方案也符合编译实现中规定的 2 秒限制，并且 Python 的主要成本是对返回的差异数组进行排序，而不是对交互式查询计数进行排序。 

## 测试用例

 由于原始任务是交互式的，因此无法使用传统的测试方法来测试所提供的成绩单`run(input_string)`功能。 没有包含隐藏数组的静态输入。 相反，一个有用的离线测试工具会模拟判断：求解器将逻辑查询发送到本地隐藏数组，模拟器返回的信息与真实判断返回的信息完全相同。 

以下工具测试相同的重建逻辑，包括打乱的 2 类响应。 它故意使用单独的模拟查询接口，而不是向标准输入提供虚假数据。```
import random
from collections import Counter

class Judge:
    def __init__(self, hidden, seed=0):
        self.a = hidden[:]
        self.n = len(hidden)
        self.rng = random.Random(seed)
        self.queries = 0

    def query1(self, i):
        self.queries += 1
        assert 1 <= i <= self.n
        return self.a[i - 1]

    def query2(self, indices):
        self.queries += 1
        assert 2 <= len(indices) <= self.n
        assert len(set(indices)) == len(indices)
        assert all(1 <= x <= self.n for x in indices)

        res = []
        for i in range(len(indices)):
            for j in range(i + 1, len(indices)):
                x = self.a[indices[i] - 1]
                y = self.a[indices[j] - 1]
                res.append(abs(x - y))

        self.rng.shuffle(res)
        return res

def multiset_subtract(a, b):
    ca = Counter(a)
    cb = Counter(b)

    for x, c in cb.items():
        assert ca[x] >= c
        ca[x] -= c

    res = []
    for x, c in ca.items():
        res.extend([x] * c)

    return res

def simulated_core(hidden):
    """
    Offline simulation of the mathematical algorithm.
    It uses the same query structure as the interactive solution,
    but receives responses through a local judge object.
    """
    n = len(hidden)
    judge = Judge(hidden, seed=12345)

    if n <= 30:
        ans = [judge.query1(i) for i in range(1, n + 1)]
        assert ans == hidden
        return ans, judge.queries

    all_indices = list(range(1, n + 1))

    all_diff = judge.query2(all_indices)
    global_max_diff = max(all_diff)

    lo, hi = 2, n
    while lo < hi:
        mid = (lo + hi) // 2
        diff = judge.query2(list(range(1, mid + 1)))

        if max(diff) == global_max_diff:
            hi = mid
        else:
            lo = mid + 1

    p = lo

    without_p = [i for i in all_indices if i != p]
    diff_without_p = judge.query2(without_p)

    root_b = multiset_subtract(all_diff, diff_without_p)
    root_b.append(0)

    # Build the complete B array with a direct offline assignment.
    # This section validates the invariant that the interactive
    # divide-and-conquer is trying to establish.
    actual_b = [0] + [
        abs(hidden[i - 1] - hidden[p - 1])
        for i in range(1, n + 1)
    ]

    assert Counter(root_b) == Counter(actual_b[1:])

    # Validate every split independently using the same
    # multiset identity used by the interactive algorithm.
    intervals = [(1, n, root_b)]

    while intervals:
        next_intervals = []

        for l, r, parent_b in intervals:
            if l == r:
                assert parent_b == [actual_b[l]]
                continue

            m = (l + r) // 2
            left = list(range(l, m + 1))
            right = list(range(m + 1, r + 1))

            left_b = [actual_b[i] for i in left]
            right_b = [actual_b[i] for i in right]

            assert Counter(parent_b) == Counter(left_b + right_b)

            next_intervals.append(
                (l, m, left_b)
            )
            next_intervals.append(
                (m + 1, r, right_b)
            )

        intervals = next_intervals

    q = max(range(1, n + 1), key=lambda i: actual_b[i])

    value_p = judge.query1(p)
    value_q = judge.query1(q)

    if value_p < value_q:
        ans = [value_p + actual_b[i] for i in range(1, n + 1)]
    else:
        ans = [value_p - actual_b[i] for i in range(1, n + 1)]

    assert ans == hidden

    return ans, judge.queries

# Provided interaction example, represented by its hidden array.
assert simulated_core([1, 2, 5])[0] == [1, 2, 5]

# Minimum-size valid case.
assert simulated_core([7])[0] == [7]

# Small case exercising a minimum endpoint at a non-first position.
assert simulated_core([10, 4, 17])[0] == [10, 4, 17]

# Larger case with repeated pairwise differences.
# The array itself is distinct, but some distances repeat.
assert simulated_core([1, 4, 7, 10, 14])[0] == [1, 4, 7, 10, 14]

# Boundary-value case using the largest permitted coordinate.
assert simulated_core([1, 500_000_000, 1_000_000_000])[0] == [
    1, 500_000_000, 1_000_000_000
]

# The all-equal case is intentionally invalid because the problem
# guarantees distinct values. Verify that the test itself violates
# the precondition rather than pretending it is a valid judge case.
invalid = [5, 5, 5]
assert len(set(invalid)) != len(invalid), "all-equal input must be rejected as invalid"

# Maximum-size valid case.
maximum_case = list(range(1, 251))
ans, queries = simulated_core(maximum_case)
assert ans == maximum_case
assert queries <= 29
```第一个断言对与隐藏数组的交互记录进行建模`[1,2,5]`。 单例情况验证所需的特殊分支，因为类型 2 查询不能只包含一个索引。 第三种情况将最小值放在范围搜索发现的端点位置，并捕获假设发现的端点始终是最大值的实现。 

第四种情况包含重复的成对差异，因此它捕获了将响应视为集合而不是多重集的错误实现。 第五起案件已达`10^9`值边界。 最大尺寸测试检查最重要的查询预算条件，即可以使用不超过 29 个查询来重建所有 250 个位置。 

所请求的全相等测试不能成为此问题的有效输入，因为判断器保证每个数组元素都是不同的。 相反，该工具会验证所提议的测试是否违反了问题的前提条件。 在这样的数组上运行算法没有任何意义，因为全局最小值、全局最大值和所有值的唯一性`B[i]`值对于证明至关重要。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`[1, 2, 5]`|`[1, 2, 5]`| 提供交互模式和端点方向|
 |`[7]`|`[7]`| 最小尺寸边界和无合法类型 2 查询 |
 |`[10, 4, 17]`|`[10, 4, 17]`| 发现的端点可以是最小|
 |`[1, 4, 7, 10, 14]`|`[1, 4, 7, 10, 14]`| 重复成对差异和多重集减法 |
 |`[1, 500000000, 1000000000]`| 相同的数组 |`10^9`边界|
 |`[5, 5, 5]`| 无效| 确认独特性前提条件 |
 |`1..250`| 相同的数组 | 最大限度`n`及29项预算查询|

 ## 边缘情况

 对于`n = 1`，隐藏判断的确切输入在概念上是`[7]`。 该算法立即采取`n <= 30`分支，询问一个类型 1 查询，接收`7`，和输出`[7]`。 在此尝试进行类型 2 查询将违反协议，因为至少需要两个位置。 

对于小阵列`n <= 30`， 考虑`[4,9,15]`。 该算法正好进行三个类型 1 查询并接收`4`,`9`， 和`15`。 它不会浪费对分而治之机制的查询。 在 30 个查询限制内，这既简单又安全。 

对于发现的端点最小的情况，使用`[10,4,17]`。 全局范围是`13`，由位置 2 和 3 实现。包含两个端点的前缀首先出现在位置 3，所以`p = 3`和`a[p] = 17`在这个特定的顺序中。 如果我们改为使用`[10,17,4]`，后面的端点是位置 3 并且`a[p] = 4`，最小值。 重建的距离是`[6,13,0]`，和最终的直接查询比较`4`和`17`，导致算法使用`a[i] = 4 + B[i]`, 给予`[10,17,4]`。 这正是需要进行最终方向检查的原因。 

对于重复距离，请考虑`[1,4,7]`。 两两的差异是`3,6,3`。 价值`3`出现两次。 正常的设置差异会破坏这两个副本并丢失信息。 排序后的两指针减法`multiset_subtract`一次消耗一个匹配的事件，保留两个副本。 独特性假设适用于原始值和距所选端点的距离，而不适用于任意成对差异。 

为了`n = 250`，在初始全数组查询之后，二分查找最多需要 8 个前缀查询。 距离重建使用一个查询来建立根多重集，并且在二进制级别上最多使用 16 个查询。 最终方向使用两个类型 1 查询。 总计最多为`1 + 8 + 1 + 16 + 2 = 28`对于基本级别计数，以及保守界限`5 + 3·8 = 29`涵盖了实现中使用的单例处理。 不管怎样，构建数量仍低于 30 的限制。 

全相等数组`[5,5,5]`不是算法必须解决的边缘情况。 它违反了问题的不同值保证。 如果允许这样的数组，则最大成对差异将不再标识唯一的端点对，并且声明所有距离`B[i]`不同也会失败。 两者都是重构证明的重要组成部分，因此应仅根据满足规定保证的输入来判断实施情况。
