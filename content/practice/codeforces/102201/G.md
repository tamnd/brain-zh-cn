---
title: "CF 102201G - 好套装"
description: "我们在所有 (k) 位整数的布尔宇宙中工作，因此有 (2^k) 个可能的元素。 一个好的集合是这些整数的非空族，在按位 AND 和按位 OR 下都是封闭的。"
date: "2026-08-18T01:44:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102201
codeforces_index: "G"
codeforces_contest_name: "Moscow Pre-Finals Workshop 2019. KAIST Contest"
rating: 0
weight: 102201
solve_time_s: 329
verified: true
draft: false
---

[CF 102201G - 好套装](https://codeforces.com/problemset/problem/102201/G)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在所有 (k) 位整数的布尔宇宙中工作，因此有 (2^k) 个可能的元素。 一个好的集合是这些整数的非空族，在按位 AND 和按位 OR 下都是封闭的。 输入给出了几个不同的整数，它们必须全部属于该家庭，任务是计算满足该要求的每个好家庭。 

关键的困难在于宇宙最多包含 (128) 个整数，但它们的族可能有 (2^{128}) 个不同的候选者。 直接枚举宇宙的子集是不可能的。 相反，小界限 (k\le 7) 告诉我们位位置的数量很少。 我们应该利用布尔晶格的子晶格结构而不是宇宙的大小 (2^k)。 

有两种边界情况值得特别注意。 首先，(n=0) 意味着不需要整数。 空要求并不意味着答案是（0），因为每个非空好集合都是有效的。 例如，对于 (k=1,n=0)，有效集合为 ({0})、({1}) 和 ({0,1})，因此答案为 (3)。 其次，单例在 AND 和 OR 下始终是封闭的。 因此，对于 (k=2,n=1,a_1=0)，必须对单例 ({0}) 进行计数。 在构建假设空集和完整宇宙都存在的表示时，忘记单例格是一个很容易犯的错误。 

还有一个由“distinct”一词引起的微妙情况。 具有值 (1,1) 的输入（例如 (k=3,n=2)）无效，因此在合法输入中不能进行“所有相等值”测试。 相关情况是（n=1），其中单个所需值可以具有任何位模式。 

## 方法

 明显的强力方法是枚举 (2^k) 个可能整数的每个子集，测试它是否包含所有所需的值，然后测试每对元素在 AND 和 OR 下的闭包。 即使对于（k=7），这也意味着考虑（2^{128}）个家庭，这是遥不可及的。 问题不在于要求我们优化 (128) 个元素的扫描。 它要求我们完全避免列举任意的家庭。 

有用的观察是，一个好的族正是布尔格的子格。 每个有限子格都有一个最小元素（通过对其所有成员进行“与”运算而获得）和一个最大元素（通过对其所有成员进行“或”运算而获得）。 始终为 (0) 或始终为 (1) 的坐标可以立即分开。 其余的坐标是家庭内部实际不同的坐标。 

现在考虑那些变量坐标。 如果好集合的每个成员都给它们相同的位，则两个坐标是等效的。 同样，它们总是一起出现。 我们可以用一个抽象坐标来替换每个等价类。 在此压缩之后，每个剩余的坐标都可以被晶格的某些成员真正区分，因此生成的子晶格具有满秩。 

秩为 (r) 的布尔格的满秩子格与 (r) 标记元素上的偏序处于双射状态。 给定一个偏序，取其所有向下封闭的子集。 它们在交集和并集下是封闭的，并且因为顺序是反对称的，所以它们区分所有 (r) 抽象坐标。 相反，当每个包含 (y) 的晶格元素也包含 (x) 时，从满秩子格定义 (x\le y)。 由此产生的关系是一个偏序关系，而原始晶格正是它的理想族。 

这将原来的问题变成了一个非常小的枚举。 我们选择哪些位位置是可变的，将这些位置划分为等价类，然后选择这些类的偏序。 所需的整数对该偏序仅施加一个条件：每个所需的整数必须对应于一个理想值。

对于固定分区，每个块都有一个签名，描述哪些所需的整数包含该块。 仅当每个包含 (y) 的所需整数也包含 (x) 时，才允许偏序关系 (x<y)。 我们不是显式地构造关系约束，而是枚举偏序本身。 由于 (k\le7)，对于等级 (1) 到 (7)，标记的偏序数仅为 (1,3,19,219,4231,130023,5941889)。 

偏序可以递归地生成。 从 (r) 标记顶点上的偏序开始并插入一个新顶点。 它的前驱形成下集 (D)，其后继形成上集 (U)，并且 (D) 的每个元素都必须低于 (U) 的每个元素。 每个有效对 ((D,U)) 恰好给出一个扩展，因此这会恰好生成每个标记偏序一次。 

最终的实现并没有构建每个偏序的所有理想。 对于顶点 (v)，令 (down[v]) 为其严格前驱。 当子集 (S) 包含 (v) 但缺少 (down[v]) 的某些成员时，它就不是理想子集。 我们将所有 (2^r) 个子集编码为一个 Python 整数的位。 这使我们能够仅使用少量位运算来计算偏序的非理想集合，然后使用一个整数 AND 来测试每个分区。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^{2^k}\cdot 2^{2k})) | (O(2^k)) | 太慢了 |
 | 结构枚举 | (O(P_7\cdot k\cdot Q_7)) | (O(P_7)) 生成的状态被流式传输 | 已接受 |

 这里 (P_7=5,941,889) 是七个元素上标记的偏序数，(Q_7) 是与输入相关的不同分区约束的数量。 对于 (k\le7)，所有这些量对于结构枚举来说都足够小。 

## 算法演练

 1. 读取所需的整数并计算每个位位置的签名。 坐标 (b) 的签名是输入值的位集，当 (a_i) 包含坐标 (b) 时，位 (i) 被准确设置。 其签名随所需值变化的坐标不能在有效族内固定，而常量坐标可以保持固定或成为可变块的一部分。 
2. 枚举包含所有变化坐标的每个可变坐标掩码 (V)。 外部（V）的坐标是固定的，并且它们的固定值已经由公共输入模式确定。 
3. 对于每个 (V)，将其坐标的每个分区枚举到非空块中。 仅当块的所有坐标具有相同的输入签名时，块才有效。 否则，同一等价类中的两个坐标就已经可以通过所需的整数来区分，这是不可能的。 
4. 对于每个有效分区，将每个所需整数映射到块的子集。 当整个块出现在所需的整数中时，子集正好包含块 (j)。 将这些所需块子集的集合编码为一个整数`req`，其中如果子集 (S) 出现在需求中，则设置位 (S)。 小组平等`req`值并保持其多重性，因为不同的坐标划分可以对抽象偏序施加相同的条件。 
5. 递归地生成 (0,1,\ldots,r-1) 上的所有偏序。 当添加新顶点（r）时，选择旧订单的下集（D）作为其前辈。 可能的后继者形成 (D) 的所有元素的共同上限。 该公共上限集合内的任何翻转集 (U) 都会给出有效的扩展。 
6. 对于每个生成的偏序，计算一个位集`bad`其集合位正是非理想的子集。 对于每个顶点 (v)，每个包含 (v) 但不包含所有顶点的子集`down[v]`很糟糕。 这些集合在所有顶点上的并集是完整的非理想掩模。 
7. 分区约束`req`恰好满足`req & bad == 0`。 将每个满足约束的重数添加到该偏序排序的答案中。 
8、n=0的情况单独处理。 没有输入签名来约束构造，因此我们使用预先计算的标记偏序数和斯特林数分区计数来计算所有可能的固定坐标选择和所有可能的可变坐标分区。 

处理完所有偏序后，累计计数正是包含每个所需整数的不同好集合的数量。 

### 为什么它有效

 每个好的集合都有一组不同的唯一坐标，将这些坐标独特地划分为始终表现相同的类，以及这些类上的唯一全秩子格。 后者由偏序唯一地表示，其理想正是好集合的可能成员。 

输入约束被精确地保留，因为当且仅当其块表示是所选偏序的理想时，所需的整数属于所表示的格。 该构造考虑了每一种可能的坐标分解和每一种可能的偏序，而每个生成的好集合只有一个这样的规范分解。 因此，每个有效的好集合都会被计算一次，并且不会计算无效的集合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# Number of labeled partial orders on 0..7 elements.
POSets = [1, 1, 3, 19, 219, 4231, 130023, 5941889]

def partitions(mask):
    """Yield every unordered partition of the set bits of mask."""
    if mask == 0:
        yield ()
        return

    bit = mask & -mask
    rest = mask ^ bit

    for p in partitions(rest):
        # Put bit into an existing block.
        for i in range(len(p)):
            q = list(p)
            q[i] |= bit
            yield tuple(q)

        # Start a new block. Blocks stay ordered by their minimum bit.
        yield (bit,) + p

def solve_case(k, a):
    n = len(a)

    if n == 0:
        # g[r] = number of sublattices of B_r containing both
        # the empty set and the full set.
        # g[r] = sum_j S(r,j) * POSets[j].
        stirling = [[0] * 8 for _ in range(8)]
        stirling[0][0] = 1
        for i in range(1, 8):
            for j in range(1, i + 1):
                stirling[i][j] = stirling[i - 1][j - 1] + j * stirling[i - 1][j]

        bounded = [0] * 8
        for r in range(8):
            bounded[r] = sum(
                stirling[r][j] * POSets[j]
                for j in range(r + 1)
            )

        ans = 0
        for r in range(k + 1):
            # Choose r variable coordinates. Every other coordinate
            # can independently be fixed to 0 or 1.
            ans += (
                (1 << (k - r))
                * __import__("math").comb(k, r)
                * bounded[r]
            )
        return ans

    # Signature of every original coordinate.
    # Bit i is set when coordinate b occurs in a[i].
    sig = [0] * k
    for i, x in enumerate(a):
        bit = 1 << i
        for b in range(k):
            if (x >> b) & 1:
                sig[b] |= bit

    # Coordinates with non-constant signatures must be variable.
    varying = 0
    for b in range(k):
        if sig[b] != 0 and sig[b] != (1 << n) - 1:
            varying |= 1 << b

    # queries[r] is a dictionary:
    #   required-ideal-mask -> number of coordinate partitions producing it
    queries = [dict() for _ in range(k + 1)]

    all_coords = (1 << k) - 1

    # Every variable mask must contain all genuinely varying coordinates.
    optional = all_coords ^ varying
    sub = optional

    while True:
        V = varying | sub

        for blocks in partitions(V):
            r = len(blocks)

            # Every block must consist of coordinates with identical
            # signatures among the required elements.
            block_sig = []
            valid = True

            for block in blocks:
                first = block & -block
                b0 = first.bit_length() - 1
                s = sig[b0]

                rest = block ^ first
                while rest:
                    bit = rest & -rest
                    b = bit.bit_length() - 1
                    if sig[b] != s:
                        valid = False
                        break
                    rest ^= bit

                if not valid:
                    break
                block_sig.append(s)

            if not valid:
                continue

            # Convert every required integer into its block mask.
            req = 0
            for i in range(n):
                mask = 0
                ibit = 1 << i

                for j, s in enumerate(block_sig):
                    if s & ibit:
                        mask |= 1 << j

                req |= 1 << mask

            queries[r][req] = queries[r].get(req, 0) + 1

        if sub == 0:
            break
        sub = (sub - 1) & optional

    # For r=0 there is exactly one partial order.
    # Its only subset is the empty set, which is always an ideal.
    answer = 0
    if queries[0]:
        # A legal r=0 representation is a singleton.
        answer += sum(queries[0].values())

    # Process all partial orders of every rank in one recursive generation.
    for target in range(1, k + 1):
        if not queries[target]:
            continue

        # We generate only up to this target. Since targets are processed
        # separately, the code remains simple and k <= 7 keeps this safe.
        qitems = list(queries[target].items())

        contain_all = [0] * (1 << target)
        subset_count = 1 << target
        full_subset_bits = (1 << subset_count) - 1

        for d in range(subset_count):
            x = 0
            s = d
            while s < subset_count:
                x |= 1 << s
                s += 1
            contain_all[d] = x

        # The loop above is intentionally replaced below by a direct
        # construction, which is faster for these tiny dimensions.
        for d in range(subset_count):
            x = 0
            for s in range(subset_count):
                if (s & d) == d:
                    x |= 1 << s
            contain_all[d] = x

        contains_vertex = [
            contain_all[1 << v]
            for v in range(target)
        ]

        local_answer = 0

        def process(down):
            nonlocal local_answer

            bad = 0
            for v in range(target):
                bad |= contains_vertex[v] & (
                    full_subset_bits ^ contain_all[down[v]]
                )

            for req, multiplicity in qitems:
                if (req & bad) == 0:
                    local_answer += multiplicity

        def generate(m, down):
            if m == target:
                process(down)
                return

            old_all = (1 << m) - 1

            up = [0] * m
            for v in range(m):
                mask = 0
                for w in range(m):
                    if (down[w] >> v) & 1:
                        mask |= 1 << w
                up[v] = mask

            size = 1 << m
            is_down = [False] * size
            is_up = [False] * size
            is_down[0] = True
            is_up[0] = True

            for s in range(1, size):
                bit = s & -s
                v = bit.bit_length() - 1
                rest = s ^ bit

                is_down[s] = (
                    is_down[rest]
                    and (down[v] & ~s) == 0
                )
                is_up[s] = (
                    is_up[rest]
                    and (up[v] & ~s) == 0
                )

            xbit = 1 << m

            for D in range(size):
                if not is_down[D]:
                    continue

                # U must consist only of elements strictly above every
                # member of D.
                C = old_all
                bits = D
                while bits:
                    bit = bits & -bits
                    v = bit.bit_length() - 1
                    C &= up[v]
                    bits ^= bit

                U = C
                while True:
                    if is_up[U]:
                        nd = list(down)
                        nd.append(D)

                        bits2 = U
                        while bits2:
                            bit = bits2 & -bits2
                            v = bit.bit_length() - 1
                            nd[v] |= xbit
                            bits2 ^= bit

                        generate(m + 1, tuple(nd))

                    if U == 0:
                        break
                    U = (U - 1) & C

        generate(0, ())
        answer += local_answer

    return answer

def main():
    k, n = map(int, input().split())

    if n:
        a = list(map(int, input().split()))
    else:
        a = []

    print(solve_case(k, a))

if __name__ == "__main__":
    main()
```第一部分`solve_case`句柄 (n=0)，其中不需要签名信息。 秩 (r) 的有界子格的数量是通过将 (r) 坐标划分为等价类并对这些类进行满秩偏序来获得的。 斯特林数对分区进行计数。 

对于 (n>0)，`sig[b]`准确记录哪些所需值包含坐标 (b)。 面具`varying`标识其值在所需输入中不是恒定的坐标。 这样的坐标在每个有效晶格中必须是可变的，而每个其他坐标可以是固定的或可变的。 

这`partitions`生成器使用最小的剩余坐标来保持块的规范排序。 这避免了对相同的无序分区进行多次计数。 

字典`queries[r]`是原始位位置和抽象偏序集之间的桥梁。 单个字典键描述了所有必需的理想子集。 它的多重性记录了有多少不同的坐标分区导致完全相同的抽象需求。 

递归`generate`函数通过插入新的最大标记顶点来构造偏序。`D`包含其前身和`U`它的继任者。 前驱集必须是下集，后继集必须是上集，并且每个前驱集都必须低于每个后继集。 这些条件正是使所得关系具有传递性的原因。 

这`bad`bitset 是最有用的实现技巧。`contain_all[d]`包含每个子集掩码，其中包含`d`。 对于顶点 (v)，表达式`contains_vertex[v] & ~contain_all[down[v]]`表示包含 (v) 但缺少至少一个前驱的所有子集。 他们的结合恰恰是非理想的集合。 

Python 整数是任意精度的，因此这里的位集可以安全地包含 (2^7=128) 位。 不存在整数溢出问题。 分区的子集掩码最多使用七位，而外部`req`mask 最多使用 (128) 位。 

## 工作示例

 ### 示例 1

 第一个样本是 (k=2,n=1,a_1=0)。 由于只需要一个值，因此两个位位置都具有恒定签名 (0)。 它们可以是固定的，也可以是可变的。 

| 可变坐标| 分区| 抽象块的数量| 包含 0 | 的有效偏序
 | ---| ---| ---| ---|
 | 无 | 空分区| 0 | 1 |
 | 位 0 | ({0}) | 1 | 1 |
 | 位 1 | ({1}) | 1 | 1 |
 | 两者 | ({0,1}) | ({0,1}) | 1 | 1 |
 | 两者 | ({0},{1}) | 2 | 3 |

 前四场比赛给出了四场不错的比赛。 最终分区有两个块，两个标记元素上的每个偏序都以空集作为理想，因此所有三个偏序都有效。 总数为 (1+1+1+1+3=7)，与样本输出匹配。 

此跟踪还说明了为什么必须对诸如 ({0}) 之类的单例进行计数。 零块表示是一个真正的好集合，而不是一个无效的空族。 

### 示例 2

 对于 (k=4) 和所需值 (1,2,7)，坐标签名足够不同，以至于几个坐标被迫保持可变。 对于每个候选变量掩码，分区步骤拒绝包含所需签名不同的坐标的任何块。 

对于幸存的分区，每个所需的整数都成为抽象块的子集。 然后，偏序生成器仅计算所有三个子集均为理想的阶数。 

| 所需值 | 抽象块蒙版|
 | ---| ---|
 | 1 | 由包含位 0 的块确定 |
 | 2 | 由包含位 1 | 的块确定
 | 7 | 由包含位 0、1、2 的块确定 |

 将抽象块扩展回其原始坐标后，每个接受的偏序都代表一个不同的好集合。 将所有有效分区和阶数相加得到 (29)，即样本输出。 

这里重要的不变量是，永远不会通过显式构造整个格来检查所需的值。 它的成员资格被简化为一个问题：它的抽象块子集是否是理想的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 最差结构枚举中的 (O(P_7\cdot k + C_k\cdot P_7)) | (P_7=5,941,889)，而 (k\le7) 且相关分区约束的数量很小 |
 | 空间| (O(k2^k)) 除了递归 | 所有子集条件最多使用 (128) 位，并且部分顺序是流式传输而不是存储 |

 与蛮力的关键区别在于，该算法最多枚举七个抽象坐标上的偏序，而不是 (128) 元素宇宙的任意子集。 最大的标记偏序计数约为 (5.9) 万，这是有限且可管理的，并且递归生成器永远不会同时存储所有这些。 

## 测试用例```python
# This test harness assumes the editorial solution has been placed above
# in a file named solution.py. For a standalone local test, copy the
# solve_case function and main implementation into the same file.

import sys
import io

# Reuse the solve_case function from the solution.
# The helper accepts exactly the input format used by the judge.
def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        k, n = map(int, input().split())
        a = list(map(int, input().split())) if n else []
        print(solve_case(k, a))
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("2 1\n0\n") == "7", "sample 1"
assert run("4 3\n1 2 7\n") == "29", "sample 2"

# Minimum k, one required value.
assert run("1 1\n0\n") == "2", "minimum size"

# Same boundary case, but requiring the other element.
assert run("1 1\n1\n") == "2", "upper boundary"

# Two extreme elements in B_2.
# The valid families are {0,3}, {0,1,3}, {0,2,3}, and the full B_2.
assert run("2 2\n0 3\n") == "4", "fixed minimum and maximum"

# Maximum-size input. Requiring every element forces the entire universe.
assert run(
    "7 128\n" +
    " ".join(map(str, range(128))) +
    "\n"
) == "1", "all elements required"

# No required elements.
assert run("7 0\n") == "12982681", "empty requirement"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 0`| 2 | 最小 (k)、单例和全套案例 |
 |`1 1 / 1`| 2 | 对称上边界|
 |`2 2 / 0 3`| 4 | 所需的最小值和最大值，包括中间格 |
 |`7 128 / 0 ... 127`| 1 | 最大值（n），迫使唯一的全宇宙|
 |`7 0`| 12982681 | 空要求和单独(n=0)计数公式 |

 ## 边缘情况

 对于 (k=1,n=1,a_1=0)，输入只有两个可能的整数：(0) 和 (1)。 包含 (0) 的好集合是 ({0}) 和 ({0,1})，所以答案是 (2)。 该算法获得一种没有变量坐标的表示和一种具有单个坐标变量的表示。 

对于(k=2,n=1,a_1=0)，答案是(7)。 零块表示给出 ({0})，一块表示给出 ({0,1})、({0,2}) 和 ({0,3})，两块表示贡献两个元素上的所有三个偏序。 总数为(7)。 

对于具有所需值 (0) 和 (3) 的 (k=2,n=2)，两个坐标在输入中都会变化，因此两者都必须属于变量部分。 一块划分给出 ({0,3})。 两块划分给出了三个满秩子格，对应于两个标记元素上的三个偏序。 因此答案为（4）。 

对于 (k=7,n=128)，需要每个可能的整数。 每个位的位置都不同，因此没有固定的坐标。 此外，每个坐标必须形成自己的等价类，因为输入包含区分每对坐标的值。 所需的块子集是七个抽象坐标的所有（128）子集。 每个子集都是理想的唯一偏序是反链，其理想格子是整个布尔格子。 因此答案正是（1）。 

对于(n=0)，没有签名信息，并且每个坐标可以固定为(0)、固定为(1)、或放入变量等价类之一。 对于秩 (r)，有界子格的数量是偏序计数的斯特林变换。 将此与变量坐标的选择和固定坐标的 (2^{k-r}) 分配相结合，给出 (12,982,681) 个良好的 (k=7) 集合。 这种情况无法通过基于签名的需求检查来处理，因为没有从中派生签名的所需值。
