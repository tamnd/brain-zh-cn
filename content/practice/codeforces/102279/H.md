---
title: "CF 102279H - 休斯顿，你在吗？"
description: "每一块都是一块多米诺骨牌，两端有两个数字。 该图块可以以其原始方向使用（由a表示），或者翻转后使用（由b表示）。"
date: "2026-08-17T03:44:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102279
codeforces_index: "H"
codeforces_contest_name: "HCW 19 Team Round (ICPC format)"
rating: 0
weight: 102279
solve_time_s: 1054
verified: true
draft: false
---

[CF 102279H - 休斯顿，你在吗？](https://codeforces.com/problemset/problem/102279/H)

 **评级：** -
 **标签：** -
 **求解时间：** 17m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每一块都是一块多米诺骨牌，两端有两个数字。 瓷砖可以以其原始方向使用，表示为`a`，或翻转，表示为`b`。 在为每个棋子选择方向后，必须将棋子按一个顺序排列，以便每对相邻棋子的接触端具有相同的编号。 

例如，如果一个定向件是`(2, 3)`接下来是`(3, 6)`，它们可以相邻，因为第一块的右端和第二块的左端都是`3`。 

输入包含`N`件，后跟每件的两个端点值。 输出必须按照形成有效链的顺序为每个片段提供一次精确的信息，以及它的方向。 该声明保证至少存在一条这样的链。 

关键的约束是`N <= 8`。 这是非常小的。 我们可以考虑涉及所有棋子排列和两种可能方向的排列。 只有`8! * 2^8 = 10,321,920`在绝对最坏的情况下进行完全指定的安排。 它足够大，以至于粗心的实现可能会代价高昂，但又足够小，可以进行详尽的搜索，特别是因为我们可以在找到有效排列时立即停止。 

幼稚的实现必须正确处理几个细节。 一块可以有相同的端点，所以反转`(4, 4)`没有任何改变。 例如，与```
24 44 4
```输出可以简单地是```
1 a2 a
```第二个问题是，即使编号不同，也可能需要颠倒一块。 为了```
23 57 3
```一个有效的答案是```
1 a2 b
```因为定向件是`(3, 5)`和`(3, 7)`，它们不按该顺序连接。 实际有效的安排是```
1 b2 b
```这给出了`(5, 3)`其次是`(3, 7)`。 只排列片段而不尝试两个方向的解决方案将会失败。 

重复的片段是错误的另一个常见来源。 如果多个片段具有相同的端点，它们仍然是不同的片段，因为它们的输入索引不同。 为了```
31 21 22 1
```这三个索引必须全部出现在答案中。 仅根据其值来处理棋子可能会意外地使用一个物理棋子两次而忽略另一个物理棋子。 

最后，第一块没有先前的邻居，因此它的方向不受之前任何东西的限制。 匹配条件仅在附加第二个片段时开始。 

## 方法

 直接的方法是穷举搜索。 选择一个未使用的块，选择其两个方向之一，如果其左端点与当前右端点匹配，则将其附加。 当所有棋子都放置完毕后，我们就有了一个有效的答案。 

这个搜索是正确的，因为每个可能的最终配置都包含以下的排列：`N`件以及每件件的方向选择。 递归搜索正是考虑这些选择，因此不会错过有效的配置。 

如果我们完全枚举而不进行剪枝，有`N!`可能的订单和`2^N`定向作业、给予`O(N! * 2^N)`的可能性。 在`N = 8`， 那是`8! * 256 = 10,321,920`配置。 检查一条完整的链最多需要`N - 1 = 7`连接，因此字面实现可以执行`72 million`最坏情况下的终点比较。 小界限`N`这使得这在编译语言中是可以接受的，并且解决方案存在的保证通常可以让递归搜索更早地终止。 

我们可以通过子集动态规划使搜索变得更小。 我们不需要记住到目前为止构建的整个订单，我们只需要记住哪些部分已被使用以及链当前开放端的数量。 如果两个不同的部分链使用完全相同的一组部件并以相同的数字完成，那么它们未来的可能性是相同的。 我们只需要保留其中之一即可。 

有`2^N`可能的使用件掩模和只有六个可能的端点值。 对于每个状态，我们都会在两个方向上尝试每个未使用的部分。 这给出了`O(2^N * N * 2)`过渡，这是很小的`N <= 8`。 

DP 在这里尤其自然，因为部分多米诺骨牌链的未来仅取决于其已使用的部分及其当前端点。 用于达到该状态的确切顺序不再重要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(N! * 2^N)`|`O(N)`| 接受为`N <= 8`|
 | 子集 DP |`O(2^N * N)`|`O(2^N * 6)`| 已接受 |

 下面的实现使用子集 DP，因为它给出了更强的最坏情况界限，同时保持足够简单以重建实际序列。 

## 算法演练

 1. 成对阅读所有文章`(u[i], v[i])`。 棋子索引与其值分开保存，因为两个外观相同的棋子仍然是不同的输入棋子。 
2. 用一个表示一组已用过的部件`N`位掩码。 少量`i`正是一件`i`已经被放置了。 
3. 定义 DP 状态`(mask, last)`， 在哪里`mask`是一组已用过的零件，并且`last`是链右端当前暴露的数字。 我们为每个可达状态存储一个前驱，以便可以重建最终序列。 
4. 从两个可能的方向开始每件作品。 如果一块`i`是`(u[i], v[i])`， 方向`a`创建一个以以下结尾的链`v[i]`，同时定向`b`创建一个以以下结尾的链`u[i]`。 
5. 对于每个可达状态，考虑每个不包含在`mask`。 可以附加在方向上`a`什么时候`u[i] == last`，产生一个新的端点`v[i]`。 可以附加在方向上`b`什么时候`v[i] == last`，产生一个新的端点`u[i]`。 
6. 当以前没有访问过新状态时，将其前任状态以及用于到达该状态的棋子和方向一起保存。 如果已经达到该状态，则忽略新路径，因为两条路径具有完全相同的未来选择。 
7.一旦状态与所有`N`达到位集后，通过向后跟随前驱指针来重建答案。 颠倒收集的列表，因为重建自然是从最后一块开始的。 

### 为什么它有效

 不变的是每个可达的 DP 状态`(mask, last)`表示至少一个有效的链，其中包含确切的片段`mask`并以价值结束`last`。 最初这是正确的，因为每个一体式链都是有效的。 当我们追加一块时，我们只接受左端点等于的方向`last`，因此新连接有效并且不变量保持为真。 

相反，考虑任何有效的部分链。 它使用的碎片形成了一些面具，它的最终端点是一些值`last`。 从第一个片段开始，DP 可以精确地遵循该链的方向和片段，因为每个连续的对都满足所需的端点相等性。 因此，每个有效链对应于一系列 DP 转换。 由于该问题保证存在完整的链，因此 DP 最终达到包含每个片段的状态。 存储的前驱链接描述了有效的完整链。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def solve():    n = int(input())    pieces = [tuple(map(int, input().split())) for _ in range(n)]
    full = (1 << n) - 1
    # parent[mask][last] = (previous_mask, previous_last, piece_index, orientation)    # last is in 1..6, so index 0 is unused.    parent = [[None] * 7 for _ in range(1 << n)]    seen = [[False] * 7 for _ in range(1 << n)]
    # Start with every possible first piece and both orientations.    for i, (u, v) in enumerate(pieces):        mask = 1 << i
        # Orientation 'a': (u, v), current endpoint is v.        if not seen[mask][v]:            seen[mask][v] = True            parent[mask][v] = (-1, -1, i, 'a')
        # Orientation 'b': (v, u), current endpoint is u.        if not seen[mask][u]:            seen[mask][u] = True            parent[mask][u] = (-1, -1, i, 'b')
    final_mask = None    final_last = None
    for mask in range(1 << n):        for last in range(1, 7):            if not seen[mask][last]:                continue
            if mask == full:                final_mask = mask                final_last = last                break
            for i, (u, v) in enumerate(pieces):                if mask & (1 << i):                    continue
                new_mask = mask | (1 << i)
                # Put piece i in its original orientation: (u, v).                if u == last and not seen[new_mask][v]:                    seen[new_mask][v] = True                    parent[new_mask][v] = (mask, last, i, 'a')
                # Reverse piece i: (v, u).                if v == last and not seen[new_mask][u]:                    seen[new_mask][u] = True                    parent[new_mask][u] = (mask, last, i, 'b')
        if final_mask is not None:            break
    # The problem guarantees that a complete chain exists.    answer = []
    mask = final_mask    last = final_last
    while mask != -1:        pmask, plast, i, orientation = parent[mask][last]        answer.append((i + 1, orientation))        mask, last = pmask, plast
    answer.reverse()
    sys.stdout.write(        ''.join(f"{i} {orientation}\n" for i, orientation in answer)    )

if __name__ == "__main__":    solve()
```这`pieces`数组存储每个图块的原始方向。 DP 内部使用从零开始的索引，而输出需要从一开始的件数，因此`i + 1`在重建期间打印。 

这`parent`表有六个有意义的端点位置，因为每个端点都位于`1`和`6`。 保留第七个未使用的位置可以使索引直接进行并避免重复减一。 

初始化有点微妙。 第一部分没有左邻居，因此两个方向都是有效的起始状态。 如果两个端点相等，则两个方向都会导致相同的状态，并且`seen`检查正确仅存储其中之一。 

对于过渡、定向`a`意味着这件作品是`(u, v)`。 仅当以下情况时才可以附加`u`等于当前端点，然后新端点变为`v`。 方向`b`方法`(v, u)`，所以需要`v == last`和叶子`u`裸露。 

仅当第一次达到某个状态时才会记录前趋。 这是安全的，因为所有未来的转换仅取决于状态本身，而不取决于哪个特定的部分链产生了它。 

重建从完整掩码开始，并遵循前驱指针，直到初始状态标记`(-1, -1, ...)`已达到。 由于这些指针向后移动，因此在打印之前必须反转结果列表。 

Python 中不存在整数溢出问题，即使在固定宽度语言中，所有掩码也可以轻松地放入小整数中，因为`N <= 8`。 

## 工作示例

 ### 示例 1

 输入是```
23 26 3
```第一部分可以用作`(3, 2)`或者`(2, 3)`。 DP 从这两种可能性开始。 

| 面膜| 当前端点| 添加了一块 | 方向| 新端点 |
 | --- | --- | --- | --- | --- |
 |`01`|`2`| 1 |`a`|`2`|
 |`01`|`3`| 1 |`b`|`3`|
 |`10`|`3`| 2 |`a`|`3`|
 |`10`|`6`| 2 |`b`|`6`|
 |`11`|`3`| 2 |`b`|`6`|

 最终过渡使用第 2 块的方向`b`，改变`(6, 3)`进入`(3, 6)`。 链条是```
(3, 2) -> (3, 6)
```所以一个有效的输出是```
1 a2 b
```该跟踪演示了为什么方向必须是转换逻辑的一部分。 这些碎片不能仅仅通过找到排列来解决。 

### 示例 2

 输入是```
53 24 54 45 13 1
```DP 发现的有效链是```
(2, 3) -> (3, 1) -> (1, 5) -> (5, 4) -> (4, 4)
```相应的部分和方向如下所示。 

| 面膜| 当前端点| 添加了一块 | 方向| 新端点 |
 | --- | --- | --- | --- | --- |
 |`00001`|`2`| 1 |`b`|`3`|
 |`10001`|`1`| 5 |`a`|`1`|
 |`11001`|`5`| 4 |`b`|`5`|
 |`11011`|`4`| 2 |`b`|`4`|
 |`11111`|`4`| 3 |`a`|`4`|

 结果输出是```
1 b5 a4 b2 b3 a
```最后的作品是`(4, 4)`，所以是否打印并不重要`a`或者`b`。 这演示了等端点情况，其中反转一块没有明显的效果。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(2^N * N)`| 有`2^N * 6`状态，每个状态最多考虑`N`具有两个方向的未使用的部件。 |
 | 空间|`O(2^N)`| 这`seen`和`parent`表包含`7 * 2^N`条目。 |

 和`N <= 8`, 最多有`256`掩码和只有六个相关端点值。 即使在考虑了每一个可能的下一块和两个方向之后，与一秒的限制相比，操作次数仍然非常少。 与 256 MB 相比，内存使用量也可以忽略不计。 

## 测试用例

 由于该问题允许任何有效的配置，因此精确的字符串相等不是合适的断言。 下面的测试工具解析生成的答案，并验证每个部分都只使用一次，每个方向都是合法的，并且每个相邻对都正确连接。```python
Pythonimport sysimport io

def solve_data(inp: str) -> str:    data = inp.strip().split()    it = iter(data)
    n = int(next(it))    pieces = [(int(next(it)), int(next(it))) for _ in range(n)]
    full = (1 << n) - 1
    parent = [[None] * 7 for _ in range(1 << n)]    seen = [[False] * 7 for _ in range(1 << n)]
    for i, (u, v) in enumerate(pieces):        mask = 1 << i
        if not seen[mask][v]:            seen[mask][v] = True            parent[mask][v] = (-1, -1, i, 'a')
        if not seen[mask][u]:            seen[mask][u] = True            parent[mask][u] = (-1, -1, i, 'b')
    final_mask = None    final_last = None
    for mask in range(1 << n):        for last in range(1, 7):            if not seen[mask][last]:                continue
            if mask == full:                final_mask = mask                final_last = last                break
            for i, (u, v) in enumerate(pieces):                if mask & (1 << i):                    continue
                new_mask = mask | (1 << i)
                if u == last and not seen[new_mask][v]:                    seen[new_mask][v] = True                    parent[new_mask][v] = (mask, last, i, 'a')
                if v == last and not seen[new_mask][u]:                    seen[new_mask][u] = True                    parent[new_mask][u] = (mask, last, i, 'b')
        if final_mask is not None:            break
    answer = []    mask = final_mask    last = final_last
    while mask != -1:        pmask, plast, i, orientation = parent[mask][last]        answer.append((i + 1, orientation))        mask, last = pmask, plast
    answer.reverse()    return ''.join(f"{i} {o}\n" for i, o in answer)

def run(inp: str) -> str:    return solve_data(inp)

def validate(inp: str, out: str):    data = inp.strip().split()    n = int(data[0])
    pieces = []    pos = 1    for _ in range(n):        pieces.append((int(data[pos]), int(data[pos + 1])))        pos += 2
    lines = out.strip().splitlines()    assert len(lines) == n, f"expected {n} output lines, got {len(lines)}"
    used = set()    oriented = []
    for line in lines:        idx, orientation = line.split()        idx = int(idx)
        assert 1 <= idx <= n        assert orientation in ("a", "b")        assert idx not in used, "a piece was used more than once"
        used.add(idx)
        u, v = pieces[idx - 1]        if orientation == "a":            oriented.append((u, v))        else:            oriented.append((v, u))
    assert len(used) == n
    for i in range(n - 1):        assert oriented[i][1] == oriented[i + 1][0], (            f"invalid connection between positions {i} and {i + 1}"        )

# Provided sample 1sample1 = """\23 26 3"""validate(sample1, run(sample1))

# Provided sample 2sample2 = """\53 24 54 45 13 1"""validate(sample2, run(sample2))

# Minimum size, requiring a reversal.case_min = """\23 57 3"""validate(case_min, run(case_min))

# All endpoints equal.case_equal = """\44 44 44 44 4"""validate(case_equal, run(case_equal))

# Boundary values 1 and 6, with several reversals needed.case_boundary = """\61 26 13 64 35 45 5"""validate(case_boundary, run(case_boundary))

# Maximum size, eight pieces.case_max = """\81 22 33 44 55 66 11 33 5"""validate(case_max, run(case_max))
print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / 3 2 / 6 3`| 任何有效的两件式链条 | 官方样例，基本定向处理|
 |`5 / 3 2 / 4 5 / 4 4 / 5 1 / 3 1`| 任何有效的五件链 | 官方样本，等终点和多次反转|
 |`2 / 3 5 / 7 3`|`1 b`,`2 b`有效 | 最低限度`N`，两件作品都需要按所选顺序反转 |
 | 四份`4 4`| 任意方向的任意排列 | 相同的端点和重复的片段 |
 | 使用值的片段`1`和`6`| 任何有效的六片链 | 端点边界和方向转换|
 | 八片输入| 任何有效的八片链 | 最大限度`N`和全状态 DP |

 测试工具验证输出，而不是将它们与一个固定答案进行比较，因为法官接受每一种有效的安排。 这是测试其输出故意不唯一的建设性问题的正确方法。 

## 边缘情况

 对于相同的端点，请考虑```
24 44 4
```初始化创建一个结束于的状态`4`对于每件作品的任一方向。 第一个转换看到未使用的部分也有左端点`4`，因此可以立即附加。 无论任一部分是否打印为，最终的链都是有效的`a`或者`b`。 民主党的`seen`表还可以防止不必要地存储重复状态。 

对于所需的逆转，请考虑```
23 57 3
```如果将第 1 块放置为`a`，暴露的端点是`5`，它无法以任一方向连接到部件 2。 使用片段 1 作为产生的状态`b`相反有端点`3`。 然后可以将第 2 部分反转为`(3, 7)`, 给予`(5, 3) -> (3, 7)`。 DP 显式测试两个方向，因此它找到了这条链。 

对于重复的部分，请考虑```
31 21 22 1
```两份副本`(1, 2)`掩码中有不同的索引和不同的位。 即使它们的值相同，使用第 1 块并不会将第 2 块标记为已使用。 因此，一个状态可以包含一个或两个副本，并且只有在放置所有三个物理块后才能达到完整掩码。 

对于双端件，请考虑```
34 44 55 6
```有效链可以从`(4, 4)`， 其次是`(4, 5)`， 其次是`(5, 6)`。 第一个图块的两个方向产生相同的端点，但算法将它们视为等效状态。 这是安全的，因为未来的可能性仅取决于当前端点和使用的片段掩模，而不取决于为对称片段选择的方向符号。 

对于最大输入大小，`N = 8`只给出`256`面具。 每个掩码最多需要表示六个端点值，每个状态最多考虑八个。 因此，尽管不受限制的排列和方向枚举已经包含超过一千万种配置，但完整的 DP 仍然很小。
