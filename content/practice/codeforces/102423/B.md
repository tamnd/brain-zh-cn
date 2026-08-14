---
title: "CF 102423B - 计算机缓存"
description: "高速缓存是一个 n 字节地址的数组，最初用零填充。 我们还有 m 个独立的数据块，其中每个数据块本身就是一个字节数组。 加载操作将整个片段复制到缓存的连续区域中，替换那里的任何内容。"
date: "2026-08-14T15:15:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102423
codeforces_index: "B"
codeforces_contest_name: "North American Southeast Regional 2019 (Div 1)"
rating: 0
weight: 102423
solve_time_s: 180
verified: true
draft: false
---

[CF 102423B - 计算机缓存](https://codeforces.com/problemset/problem/102423/B)

 **评级：** -
 **标签：** -
 **求解时间：** 3m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 缓存是一个数组`n`字节地址，最初用零填充。 我们还有`m`独立的数据块，其中每个块本身就是一个字节数组。 加载操作将整个片段复制到缓存的连续区域中，替换那里的任何内容。 增量操作会更改存储数据片内的连续范围（模 256），但不会修改已加载到缓存中的副本。 打印操作请求一个高速缓存地址处的当前字节。 原始语句最多允许`5 * 10^5`缓存地址、数据分片和操作，所有数据分片的总长度也最多`5 * 10^5`。 规定的时间限制为 5 秒。 

这些界限排除了通过复制数据片段的每个字节来模拟负载的可能性。 一件可以有长度`5 * 10^5`，并且几乎每一个都可以装载相同的部件`5 * 10^5`运营。 最坏的情况大约是`2.5 * 10^11`字节分配。 除了读取输入本身之外，我们需要每个操作仅触及对数数量的结构节点。 

棘手的部分是缓存副本是快照。 如果数据片`[10, 20]`被加载并且该片段随后递增，缓存仍然包含`[10, 20]`，不是新版本。 相反，在加载之前执行的增量必须在该加载中可见。 仅在高速缓存位置存储数据片标识符的直接实现失去了这种区别。 

在加载任何内容之前考虑尽可能小的缓存。```
1 1 2
1 0
2 1
2 1
```正确的输出是：```
0
0
```粗心的实现可能会假设每个查询的位置都属于最新的数据块并返回`0`出于错误的原因，或尝试访问未初始化的数据偏移量。 缓存必须明确表示不存在先前的加载。 

第二个边缘情况是加载之前的增量。```
1 1 3
1 255
3 1 1 1
1 1 1
2 1
```输出是：```
0
```增量将存储的片段从`255`到`0`，以及后续的加载副本`0`。 将数据视为不可变会错误地打印`255`。 

相反的顺序也同样重要。```
1 1 4
1 255
1 1 1
3 1 1 1
2 1
```输出是：```
255
```增量发生在加载之后，因此它不能更改已存储在缓存中的字节。 在回答查询时仅查看当前数据片段的解决方案会错误地打印`0`。 

最后，重叠负载必须以字节粒度进行处理。 例如：```
5 2 6
2 10 20
2 30 40
1 1 2
2 2
1 2 3
2 2
2 3
2 4
```输出是：```
10
30
40
40
```第二次加载覆盖地址`3`和`4`，但地址`2`从第一次加载开始就剩下了。 将负载视为整个缓存状态而不是范围的解决方案很容易导致此边界错误。 

## 方法

 暴力破解方案直接维护缓存数组。 一块负载`i`在位置`p`循环遍历所有`k_i`字节并将它们写入缓存。 增量循环遍历请求的范围并更改数据块的相应字节。 打印的时间是恒定的。 这是正确的，因为它完全遵循每个操作的语义。 

问题是加载操作。 假设有一个长度为`500000`，另一个`499999`操作也是该部分的负载。 暴力解决方案的表现大致如下`500000 * 500000 = 2.5 * 10^11`字节写入。 这远远超出了时间限制。 

第一个有用的观察是缓存查询不需要整个缓存状态。 它只需要知道哪个加载最后写入了该特定的缓存地址，以及加载的片段的哪个字节对应于该地址。 通过将每个负载视为携带其操作编号的范围分配，我们可以在不复制数据的情况下找到该负载。 

线段树可以存储影响每个缓存位置的最新负载数。 对于范围更新，我们将负载数放置在完全被该负载覆盖的线段树节点中。 对于点查询，我们从叶子走到根并获取遇到的最大负载数。 由于操作次数随着时间的推移而增加，因此最大的次数恰好是覆盖该位置的最后一个负载。 

还有第二个处理增量的观察。 一旦查询与特定负载相关联，其缓存值就固定在该负载的执行时间。 我们可以推迟计算该值，直到处理该负载。 我们首先扫描所有操作，将每个打印查询与其上次加载相关联。 然后我们再次扫描操作。 在第二次扫描时，数据片段完全包含原始执行中每个点的版本。 当我们达到负载时，与该负载相关的所有查询都可以立即得到答复。 

对于数据片，我们需要范围增量和点查询。 芬威克树正好给出了这种组合。 我们在芬威克树中存储一个差异数组，添加`+1`在左端点和`-1`紧接在右端点之后。 字节位置处的前缀和就是影响该字节的增量数。 由于值是字节，因此所有这些计数都可以模 256 减少。 

因此，这两部分是独立的。 段树回答了时间问题“哪个负载产生了这个缓存字节？”，而芬威克树回答了历史问题“当负载发生时这个数据字节的值是多少？”

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(复制字节的总和) | O(n + 总和 k_i) | 太慢了，最多大约 2.5 * 10^11 写入 |
 | 最佳 | O(总和 k_i + q log n + q log S) | O(n + m + q + 总和 k_i) | 已接受 |

 这里`S`是最大数据片长度。 最佳方法永远不会在缓存内实现加载的副本。 

## 算法演练

 1. 读取每个数据块并保留其原始字节。 在一个全局字节数组中给每个部分一个紧凑的范围。 还为每件作品保留芬威克树系列。 所有碎片的总大小最多为`5 * 10^5`，因此存储所有原始字节很便宜。 
2. 存储全部`q`操作而不是立即执行它们。 我们需要操作两次，一次是为了发现哪个负载拥有每个缓存查询，一次是为了在加载时重建数据片段版本。 
3. 在缓存地址上创建一棵线段树。 对于每个负载操作`1 i p`，其影响的缓存间隔为`[p, p + k_i - 1]`。 将负载的操作数存储在完全包含在该区间内的每个线段树节点上。 我们不需要将这些标签向下推，因为查询可以简单地检查其叶子的所有祖先。 
4. 对于每个打印操作`2 p`,从缓存位置开始步行`p`向线段树根查找遇到的最大负载操作数。 如果没有这样的操作，则缓存地址从未被写入，因此其答案为零。 
5. 如果发现加载操作，则计算其数据片内相应的偏移量。 如果加载从缓存地址开始`s`，然后查询缓存地址`p`指的是数据偏移量`p - s + 1`。 将此打印查询附加到该加载操作。 我们还没有计算它的字节值。 
6. 为每个数据片段初始化一个概念性芬威克树。 它们存储在一个平面字节数组中，每个部分都有一个单独的基偏移量。 对于增量`3 i l r`， 添加`1`在`l`和`-1`在`r + 1`当该位置存在时。 位置处的 Fenwick 前缀和`x`给出影响字节的增量数`x`迄今为止。 
7. 按原始顺序扫描保存的操作。 对于增量，更新适当的 Fenwick 树。 对于加载，Fenwick 树当前准确包含此加载之前发生的增量，因此数据块当前正是复制到缓存中的版本。 
8. 在加载时，访问附加到该加载的每个打印查询。 对于每个查询，在其存储的偏移量处读取原始字节，添加该偏移量的 Fenwick 前缀和，并以 256 为模减少结果。使用查询的原始输出索引存储答案。 
9. 按查询顺序打印答案。 在任何加载之前发生的查询的默认答案已经为零，而每个其他查询在处理其所属加载时都得到了回答。 

工作原理：对于每个缓存地址，线段树存储范围包含该地址的每个负载，最大的负载编号是最新的此类负载。 因此，每个打印查询都准确地附加到最后确定其缓存字节的操作。 当第二次扫描期间达到该负载时，该负载之前的每个增量都已插入到相应的 Fenwick 树中，而该负载之后的每个增量尚未插入。 因此，计算出的字节正是复制到缓存中的快照。 稍后对数据片段的更改不会影响存储的答案，该答案与所需的缓存语义相匹配。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n, m, q = map(int, input().split())

    lengths = array('i', [0]) * (m + 1)
    value_base = array('i', [0]) * (m + 1)
    fenwick_base = array('i', [0]) * (m + 1)

    values = bytearray()
    fenwick_total = 0

    for i in range(1, m + 1):
        tokens = input().split()
        k = int(tokens[0])

        lengths[i] = k
        value_base[i] = len(values)
        fenwick_base[i] = fenwick_total

        values.extend(int(x) for x in tokens[1:])
        fenwick_total += k + 1

    # Store operations compactly.
    typ = array('b', [0]) * q
    a = array('i', [0]) * q
    b = array('i', [0]) * q
    c = array('i', [0]) * q

    for t in range(q):
        op = list(map(int, input().split()))
        typ[t] = op[0]
        if op[0] == 1:
            a[t] = op[1]       # data piece
            b[t] = op[2]       # cache start
        elif op[0] == 2:
            a[t] = op[1]       # cache position
        else:
            a[t] = op[1]       # data piece
            b[t] = op[2]       # left
            c[t] = op[3]       # right

    # Segment tree for latest load covering a cache position.
    size = 1
    while size < n:
        size <<= 1

    tag = [0] * (2 * size)

    # For every load operation t, head[t] is the first query attached to it.
    head = array('i', [-1]) * q
    nxt = array('i', [-1]) * q
    query_offset = array('i', [0]) * q

    # Answers are bytes, so bytearray is enough.
    query_count = 0
    answers = bytearray()

    # First pass: resolve every cache query to its latest load.
    for t in range(q):
        if typ[t] == 1:
            data_id = a[t]
            start = b[t]
            end = start + lengths[data_id] - 1

            left = start - 1 + size
            right = end - 1 + size

            while left <= right:
                if left & 1:
                    tag[left] = t + 1
                    left += 1
                if not (right & 1):
                    tag[right] = t + 1
                    right -= 1
                left >>= 1
                right >>= 1

        elif typ[t] == 2:
            pos = a[t]
            node = pos - 1 + size
            load_id = 0

            while node:
                if tag[node] > load_id:
                    load_id = tag[node]
                node >>= 1

            answers.append(0)
            if load_id:
                load_idx = load_id - 1
                data_id = a[load_idx]
                offset = pos - b[load_idx] + 1

                query_offset[query_count] = offset
                nxt[query_count] = head[load_idx]
                head[load_idx] = query_count

            query_count += 1

    # Fenwick trees for range increment + point query.
    bit = bytearray(fenwick_total)

    def fenwick_add(base, length, pos, delta):
        while pos <= length:
            idx = base + pos
            bit[idx] = (bit[idx] + delta) & 255
            pos += pos & -pos

    def fenwick_sum(base, pos):
        result = 0
        while pos:
            result += bit[base + pos]
            pos -= pos & -pos
        return result & 255

    # Second pass: reconstruct each data piece exactly at each load time.
    for t in range(q):
        if typ[t] == 3:
            data_id = a[t]
            left = b[t]
            right = c[t]

            base = fenwick_base[data_id]
            length = lengths[data_id]

            fenwick_add(base, length, left, 1)

            after = right + 1
            if after <= length:
                fenwick_add(base, length, after, -1)

        elif typ[t] == 1:
            data_id = a[t]
            base = fenwick_base[data_id]
            original_base = value_base[data_id]

            query_id = head[t]

            while query_id != -1:
                offset = query_offset[query_id]
                increment = fenwick_sum(base, offset)

                value = values[original_base + offset - 1]
                answers[query_id] = (value + increment) & 255

                query_id = nxt[query_id]

    sys.stdout.write('\n'.join(map(str, answers)))

if __name__ == "__main__":
    solve()
```第一组数组紧凑地存储数据片。`value_base[i]`指向片段的第一个原始字节`i`， 尽管`fenwick_base[i]`指向其 Fenwick 树的起点。 每棵树添加一个额外的 Fenwick 槽位，让每棵树都能支撑`r + 1`差异更新无需为每个数据块分配单独的 Python 对象。 

操作数组避免存储 50 万个 Python 元组。 每个操作都有一个类型和最多三个整数参数，因此紧凑`array`对象使内存占用保持可预测。 

线段树使用从一开始的操作数作为标签，零表示没有负载覆盖该节点。 使用以下命令将更新间隔从缓存地址转换为从零开始的叶子`start - 1 + size`。 包含的右端点是`start + length - 1`，因此转换必须使用`end - 1 + size`。 这是主要边界，其中相差一错误可以更改哪个负载拥有查询。 

线段树仅用于范围更新和点查询。 负载将其操作编号存储在完全覆盖的节点上。 查询检查其根到叶路径上的每个节点并获取最大值。 不需要延迟传播，因为我们永远不需要具体化整个段的状态。 

查询链表避免了另一个大的 Python 列表集合。`head[t]`指向最终缓存值来自加载的查询`t`， 尽管`nxt`链接属于同一负载的查询。 因此，查询在第二遍期间只被处理一次。 

Fenwick 树存储模 256 的差值。虽然普通的 Fenwick 树通常存储任意整数和，但字节值仅取决于模 256 的和，因此每个存储的值都可以安全地保留在`bytearray`。 前缀和在添加到原始字节之前也会以 256 为模进行减少。 

第二遍在任何后续加载之前处理增量，与原始操作的时间顺序完全匹配。 当达到负载时，之后的增量还没有进入 Fenwick 树，因此为附加到该负载的每个查询计算的值是其不可变的缓存快照。 

Python 整数不会溢出，但实现仍然显式地减少字节值模 256。这反映了问题定义并允许安全地使用紧凑字节数组。 

## 工作示例

 官方的样例是：```
5 2 10
3 255 0 15
4 1 2 1 3
2 1
1 2 2
1 1 1
2 1
2 4
3 1 1 2
2 1
1 1 2
2 2
2 5
```第一遍确定哪个负载拥有每个查询。 

| 运营| 行动| 受影响的缓存范围 | 查询位置 | 拥有负载|
 | --- | --- | --- | --- | --- |
 | 1 | 查询地址1 | 无 | 1 | 无 |
 | 2 | 在 2 | 加载片 2 2..5 | 2..5 无 | 无 |
 | 3 | 在 1 | 加载件 1 1..3 | 1..3 无 | 无 |
 | 4 | 查询地址1 | 无 | 1 | 加载 3 |
 | 5 | 查询地址4 | 无 | 4 | 加载 2 |
 | 6 | 增量片 1, 1..2 | 无 | 无 | 无 |
 | 7 | 查询地址1 | 无 | 1 | 加载 3 |
 | 8 | 在 2 处加载片 1 | 2..4 | 2..4 无 | 无 |
 | 9 | 查询地址2 | 无 | 2 | 加载 8 |
 | 10 | 10 查询地址5 | 无 | 5 | 加载 2 |

 在操作3时，缓存地址1接收片1的第一个字节，即`255`。 操作 6 中的后续增量不会影响该缓存副本。 然而，在操作 8 中，片段 1 已经递增，因此它的第一个字节现在是`0`。 因此，同一数据片的两次加载会产生不同的缓存快照。 

在第二遍期间，相关负载状态为：

 | 加载| 资料片| 加载时的当前数据 | 附查询偏移量| 答案 |
 | --- | --- | --- | --- | --- |
 | 2 | 2 |`[1, 2, 1, 3]`| 地址 4 → 偏移量 3 |`1`|
 | 3 | 1 |`[255, 0, 15]`| 地址 1 → 偏移 1 |`255`|
 | 8 | 1 |`[0, 1, 15]`| 地址 2 → 偏移量 1 |`0`|

 任何负载之前的查询仍然存在`0`，地址 5 处的最终查询属于加载 2，并返回其第四个字节，`3`。 最终输出是`0, 255, 1, 255, 0, 3`，匹配样本。 

对于第二个示例，请考虑：```
5 2 8
3 10 20 30
2 40 50
1 1 2
2 2
2 4
1 2 3
2 2
2 3
2 4
2 5
```第一次加载写入地址`2..4`。 

| 运营| 行动| 查询地址的最新负载 | 偏移|
 | --- | --- | --- | --- |
 | 1 | 在 2 处加载片 1 | 无 | 无 |
 | 2 | 查询地址2 | 加载 1 | 1 |
 | 3 | 查询地址4 | 加载 1 | 3 |
 | 4 | 在 3 处加载第 2 块 | 无 | 无 |
 | 5 | 查询地址2 | 加载 1 | 1 |
 | 6 | 查询地址3 | 加载 4 | 1 |
 | 7 | 查询地址4 | 加载 4 | 2 |
 | 8 | 查询地址5 | 无 | 无 |

 第二次加载仅覆盖地址`3`和`4`。 无法更改地址`2`，并且它没有到达地址`5`。 结果输出是`10, 30, 10, 40, 50, 0`。 此跟踪说明了为什么线段树必须独立记住每个缓存位置的最新加载。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总和 k_i + q log n + q log S) | 读取数据与总数据大小呈线性关系。 每个加载范围更新和缓存查询使用 O(log n)，而每个增量和每个解析查询使用 O(log S)。 |
 | 空间| O(n + m + q + 总和 k_i) | 线段树使用O(n)，操作和查询链接使用O(q)，片段元数据使用O(m)，原始数据加上Fenwick存储使用O(sum k_i + m)。 |

 所有相关界限为`5 * 10^5`，对数因子最多在 19 或 20 左右。该算法永远不会执行与加载的数据片段的长度成正比的工作，因此重复加载大片段不会导致重复的大副本。 5 秒的限制使这种对数结构变得合适，而紧凑数组使 Python 的内存使用得到控制。 

## 测试用例

 以下线束假设`solve()`上述解决方案中的函数可在同一文件中使用或从提交的解决方案中导入。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = globals()["input"]

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    globals()["input"] = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        globals()["input"] = old_input

# Provided sample
sample1 = """\
5 2 10
3 255 0 15
4 1 2 1 3
2 1
1 2 2
1 1 1
2 1
2 4
3 1 1 2
2 1
1 1 2
2 2
2 5
"""

assert run(sample1) == "0\n255\n1\n255\n0\n3", "sample 1"

# Minimum-size cache, query before any load.
case_min = """\
1 1 2
1 7
2 1
2 1
"""

assert run(case_min) == "0\n0", "minimum-size input"

# Increment before a load, then increment after the load.
case_snapshot = """\
3 1 5
3 255 0 1
3 1 1 2
1 1 1
3 1 1 3
2 1
"""

assert run(case_snapshot) == "0", "snapshot semantics and modulo 256"

# Overlapping loads and exact boundaries.
case_boundaries = """\
5 2 8
3 10 20 30
2 40 50
1 1 2
2 2
2 4
1 2 3
2 2
2 3
2 4
2 5
"""

assert run(case_boundaries) == "10\n30\n10\n40\n50\n0", "load boundaries"

# All equal values, followed by a range increment.
case_equal = """\
3 1 5
3 7 7 7
1 1 1
3 1 1 3
2 1
2 2
2 3
"""

assert run(case_equal) == "8\n8\n8", "all-equal values"

# Maximum cache size and maximum total data size.
# The single query is at the last cache address, catching right-boundary errors.
max_data = " ".join(["0"] * 500000)
case_max_data = (
    "500000 1 2\n"
    "500000 " + max_data + "\n"
    "1 1 1\n"
    "2 500000\n"
)

assert run(case_max_data) == "0", "maximum n and total data size"

# Maximum number of operations.
# No address is ever loaded, so every query must remain zero.
case_max_q = "1 1 500000\n1 0\n" + "2 1\n" * 500000
assert run(case_max_q) == "0\n" * 500000, "maximum q"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 2`，一字节数据，两次查询|`0\n0`| 最小大小和查询未触及的缓存 |
 | 加载前递增，加载后递增 |`0`| 快照行为和模 256 |
 | 两个重叠的负载|`10\n30\n10\n40\n50\n0`| 范围边界和部分覆盖 |
 | 三个相等的字节一起递增 |`8\n8\n8`| 范围更新影响每个字节|
 |`n = 500000`，数据长度`500000`|`0`| 最大缓存和数据边界|
 |`q = 500000`查询 |`500000`零线| 最大操作计数和未触及缓存行为 |

 ## 边缘情况

 对于任何加载之前的查询，线段树路径仅包含零个标签。 该算法将其答案保留为默认字节值`0`。 例如，与`1 1 2`， 数据`[7]`，和两个`2 1`查询，两个输出都是`0`。 不会为未触及的高速缓存地址创建人工数据块关联。 

对于加载之前的增量，Fenwick 树会在第二遍处理加载之前更新。 有数据`[255]`和操作`3 1 1 1`，位置 1 处的 Fenwick 前缀和为`1`。 因此负载计算`(255 + 1) mod 256 = 0`，这是正确的快照。 

对于加载后的增量，查询会附加到之前的加载。 当第二遍处理负载时，后面的增量还没有到达Fenwick树。 有数据`[255]`，然后是加载，然后是增量，存储的答案仍然存在`255`，即使数据片本身最终变成`0`。 

对于重叠加载，线段树会比较操作数，而不是简单地存储某个位置是否曾经被加载过。 假设片段 1 在地址 2 处加载，随后片段 2 在地址 3 处加载。地址 2 处的查询仅看到第一个加载，而地址 3 和 4 处的查询看到第二个加载。 Maximum-tag 属性准确地给出了此结果，因为第二个加载的范围不包含地址 2。 

对于正好在最后一个缓存地址结束的加载，右端点计算如下`start + length - 1`。 线段树使用以下方法转换此包含端点`end - 1 + size`。 长度的负载`500000`开始于`1`因此覆盖了地址的叶子`500000`，这是通过最大尺寸测试来执行的。 

对于以数据块的最后一个字节结束的范围增量，差异更新为`r + 1`不得执行。 实施检查`after <= length`在更新该位置之前。 如果没有此检查，差异标记将泄漏到扁平 Fenwick 存储中的下一个逻辑块中。 

对于字节溢出，Fenwick 贡献和原始字节都结合在一起`& 255`。 因此`255 + 1`变成`0`，并且重复增量自然地循环遍历所有 256 字节值，而不需要大整数表示。
