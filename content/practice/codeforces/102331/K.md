---
title: "CF 102331K - 韩国流行音乐弦乐"
description: "我们需要计算 35 个字符的字母表中长度为 (n) 的字符串，即数字 1 到 9 和小写字母。 如果字符串不包含长度至少为 (n-k) 的串联重复，则该字符串有效。"
date: "2026-08-13T03:55:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "K"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 262
verified: true
draft: false
---

[CF 102331K - 韩国流行音乐弦乐](https://codeforces.com/problemset/problem/102331/K)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算 35 个字符的字母表中长度为 (n) 的字符串，即数字`1`通过`9`和小写字母。 如果字符串不包含长度至少为 (n-k) 的串联重复，则该字符串有效。 

串联重复是由两个相同的连续半部分组成的偶数长度子串。 例如，`abab`是串联重复，因为它的两半都是`ab`， 尽管`abca`不是。 输出是避免每个足够长的串联重复的长度（n）字符串的数量，模（998244353）。 

约束的有用部分是 (k) 的小值。 虽然(n)可以为100，但每个禁止重复的长度至少为(n-k)，因此可以禁止的可能间隔数量很少。 事实上，候选串联重复的数量是 (O(k^2))，对于给定的范围最多有几十个。 这使得在更强的修剪观察之后对候选重复进行包含排除搜索变得可行。 

简单地枚举所有字符串是完全不可能的。 对于 (n=100)，有 (35^{100}) 个字符串，大约 (2.5\cdot10^{154}) 个字符串。 即使检查一个字符串只需要 (O(n^2))，总数也已经约为 (10^{158}) 次操作。 直接检查每个候选子字符串和每个字符比较更接近 (O(35^n n^3))。 

在几种边界情况下，实现可能会默默地使用错误的禁止间隔集。 为了`1 16`，不能有任何串联重复，因为每个串联重复的长度都是正偶数，而字符串只有一个字符。 正确答案是`35`。 

为了`4 0`，只有长度为 4 的串联重复才符合条件。 唯一禁止的条件是(s_0=s_2)和(s_1=s_3)，所以答案是(35^4-35^2=1499400)。 此处也禁止长度为 2 的重复的解决方案是错误的。 

为了`2 16`，阈值为 (2-16=-14)，因此每个串联重复都符合资格。 唯一可能的串联重复是整个字符串，这意味着两个字符不能相等。 答案是（35\cdot34=1190）。 将阈值限制为 2 或假设 (k<n) 的粗心实现可能会错误地处理这种情况。 

为了`3 0`，阈值为 3，但串联重复必须具有偶数长度。 因此根本不存在禁止的子字符串，并且每个字符串都是有效的。 答案是（35^3=42875）。 这捕获将阈值本身视为可能的重复长度而不检查奇偶校验的代码。 

## 方法

 蛮力方法很简单。 生成每一个 (35^n) 字符串并检查它是否包含禁止的串联重复。 对于长度至少为 (n-k) 的每个偶数区间，将其前半部分与后半部分进行比较。 该测试是正确的，因为 K-pop 字符串的定义正是不存在这些间隔。 问题在于字符串的数量：在 (n=100) 时，搜索空间大约为 (2.5\cdot10^{154})，因此即使是不切实际的廉价测试也无法使这种方法发挥作用。 

关键的变化是停止枚举字符串，而是枚举禁止的模式。 特定的串联重复不需要我们了解字符本身。 它仅对职位之间施加平等约束。 例如，事件`abab`发生在位置 (0\ldots3) 处，强加 (s_0=s_2) 和 (s_1=s_3)。 

假设我们选择几个串联重复事件并要求所有这些事件同时发生。 每个等式约束连接两个字符串位置。 我们可以用不相交集联合结构来表示约束。 如果生成的等式图具有 (c) 个连通分量，则每个分量都可以独立选择 35 个字符之一，因此恰好 (35^c) 个字符串满足所有选定事件。 

这给出了包含-排除。 如果禁止事件为(E_1,E_2,\ldots,E_m)，则有效字符串的数量为

 [
 35^n-\sum_i |E_i|+\sum_{i<j}|E_i\cap E_j|-\cdots。 
]

 明显的问题是，可能有大约 80 个事件，因此 (2^m) 个子集太多了。 关键的观察是，这种包含-排除的许多分支是完全多余的。 假设已选择的事件强制当前事件 (E_i) 所需的每个相等性。 然后添加 (E_i) 根本不会改变连接的组件。 每个包含 (E_i) 的交集与不包含 (E_i) 的相应交集相同，但具有相反的包含-排除符号。 这两项贡献被取消，包括以后事件的所有可能选择。 整个分支可以立即丢弃。 

我们通过回滚 DSU 维护连接的组件。 添加事件时，我们记录每个成功的并集、递归，然后准确撤消这些并集。 我们首先处理较长的串联重复序列。 这种排序使得强约束尽早出现，并导致后来的事件更频繁地变得多余。 官方社论描述了相同的包含-排除和组件取消的想法，并建议减少重复长度作为有效的命令之一。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(35^nn^3)) | (O(n)) | (O(n)) | 太慢了|
 | 包含-排除与回滚 DSU | (O(Bn\log n)) | (O(nk^2)) | 已接受 |

 这里（B）是在冗余修剪中幸存下来的递归节点的数量。 在理论上最坏的情况下，搜索仍然是指数级的，但构造的重点是 (k\le16)，只有 (O(k^2)) 个事件，并且大多数包含-排除分支在当前事件已经隐含后立即终止。 

## 算法演练

1. 生成所有可能的禁止串联重复序列。 对于 (L\ge n-k) 的偶数长度 (L)，从 (0) 到 (n-L) 选择其起始位置 (l)。 如果 (h=L/2)，则该事件对于每个 (0\le j<h) 都需要 (s_{l+j}=s_{l+h+j})。 我们存储这些位置对而不是子字符串本身。 
2. 按长度递减对事件进行排序。 较长的重复会施加更多的平等约束，因此往往会使后面的事件变得多余。 确切的顺序不是正确性证明的一部分，但它对搜索树的实际大小有重大影响。 
3. 为每个字符串位置使用一个组件来初始化回滚 DSU。 最初有 (n) 个分量，对应于 (35^n) 个完全不受限制的字符串。 
4. 递归处理事件。 首先取当前事件未被选择进行包含排除的分支。 然后暂时将当前事件的所有等式约束添加到DSU中，并统计有多少个联合实际更改了分区。 
5. 如果添加事件未执行成功的联合，则该事件已包含在所选事件中。 它的包含和排除分支完全取消，因此从该递归状态返回零，而不检查后面的事件。 
6. 如果事件确实引入了至少一个新的等式，则递归包含该事件。 它的包含-排除符号相对于它被排除的分支为负，因此从排除的分支中减去包含的分支的结果。 
7. 当所有事件都被处理后，当前的 DSU 恰好包含所选事件子集所需的等式。 如果它有 (c) 个连通分量，则有 (35^c) 个兼容字符串。 返回该值。 
8. 在每个包含的分支之后，将 DSU 回滚到保存的快照。 这将精确恢复在考虑当前事件之前存在的分区，因此同级递归分支永远不会相互影响。 

工作原理：在每个递归状态下，DSU 准确地表示当前包含-排除路径上所选事件所施加的相等性。 连接的组件是一组被迫携带相同字符的位置，并且不同的组件是独立的，在叶子处给出 (35^c) 个分配。 如果当前事件没有创建新的组件合并，则其约束已由所选事件隐含。 对于后续事件的每个子集，与当前事件的交集与没有当前事件的交集相同，而两个包含-排除符号相反。 他们的贡献抵消了，因此返回零在数学上是精确的。 在两种可能的包含-排除选择中都会考虑每个非冗余事件，这意味着每个子集都用其正确的符号表示。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
ALPHABET = 35

def count_kpop(n, k):
    threshold = n - k

    events = []

    # An event is a forbidden tandem repeat.
    # For length L = 2*h starting at l, impose
    # s[l+j] == s[l+h+j] for 0 <= j < h.
    for L in range(max(2, threshold), n + 1):
        if L & 1:
            continue

        h = L // 2
        for l in range(n - L + 1):
            pairs = [(l + j, l + h + j) for j in range(h)]
            events.append((L, l, pairs))

    # Longer repeats first give much better pruning.
    events.sort(key=lambda x: (-x[0], x[1]))

    m = len(events)

    # powers[c] = 35^c mod MOD
    powers = [1] * (n + 1)
    for i in range(1, n + 1):
        powers[i] = powers[i - 1] * ALPHABET % MOD

    parent = list(range(n))
    size = [1] * n
    history = []
    components = n

    def find(x):
        while parent[x] != x:
            x = parent[x]
        return x

    def unite(a, b):
        nonlocal components

        a = find(a)
        b = find(b)

        if a == b:
            return False

        if size[a] < size[b]:
            a, b = b, a

        # Store enough information to undo this union.
        history.append((b, a, size[a]))

        parent[b] = a
        size[a] += size[b]
        components -= 1
        return True

    def rollback(snapshot):
        nonlocal components

        while len(history) > snapshot:
            b, a, old_size_a = history.pop()
            parent[b] = b
            size[a] = old_size_a
            components += 1

    sys.setrecursionlimit(1000000)

    def dfs(idx):
        # All selected events have now been fixed.
        if idx == m:
            return powers[components]

        # If all positions are already equal, every remaining event
        # is implied, so all inclusion-exclusion contributions cancel.
        if components == 1:
            return 0

        # Exclude the current event.
        result = dfs(idx + 1)

        # Include the current event.
        snapshot = len(history)
        changed = False

        for a, b in events[idx][2]:
            if unite(a, b):
                changed = True

        # The event was already implied by the current constraints.
        # Including or excluding it gives identical intersections,
        # so their contributions cancel completely.
        if not changed:
            rollback(snapshot)
            return 0

        result -= dfs(idx + 1)
        result %= MOD

        rollback(snapshot)
        return result

    return dfs(0)

def main():
    n, k = map(int, input().split())
    print(count_kpop(n, k))

if __name__ == "__main__":
    main()
```第一部分`count_kpop`准确地构建重要的事件。 下界是`max(2, threshold)`因为串联重复序列的长度为正偶数。 我们仍然单独测试奇偶性，因为奇数间隔不能是串联重复。 

每个事件直接存储相等位置对。 这避免了在递归期间进行任何字符串操作。 对于长度为 (2h) 的重复，正好存在 (h) 个等式约束。 

powers 数组是预先计算的，因为递归的叶子仅需要 DSU 组件的当前数量。 查找 (35^c) 的时间是常数，而不是在每个叶子节点执行模幂运算。 

DSU 故意不使用路径压缩。 路径压缩使回滚变得复杂，因为`find`操作可以修改许多父指针。 这里按大小联合就足够了，因为只有 (n\le100) 个位置，并且它使每个查找操作保持对数。 

这`history`堆栈包含撤消成功联合所需的确切信息。 失败的联合不会修改 DSU，因此不需要记录。 

最微妙的部分是`changed`测试。 仅仅询问事件是否有相等对是不够的。 每个事件都是如此。 重要的是它的至少一个等式是否连接了两个当前不同的组件。 如果没有，则该事件不添加新信息，并且其整个包含-排除子树取消。 

中的减法`result -= dfs(idx + 1)`是包含排除符号。 没有事件的分支相对于当前状态有正向贡献，而有事件的分支相对于当前状态有负向贡献。 最终的模运算使结果保持在所需的范围内。 

Python 整数不会溢出，因此所有算术都是安全的。 将模应用于递归结果是因为包含-排除可以产生负的中间值和非常大的正值。 

## 工作示例

 对于示例 1，输入为`1 16`。 长度为 1 的字符串不适合偶数间隔，因此事件列表为空。 

| 活动索引 | 组件| 行动| 贡献 |
 | ---| ---| ---| ---|
 | 0 | 1 | 不存在任何事件 | (35^1=35) | (35^1=35) |

 递归立即到达叶子并返回 (35)。 这演示了边界情况，其中非常小的字符串不能包含任何串联重复，无论 (k) 的值如何。 

对于示例 2，输入为`4 0`。 阈值为 4，因此唯一禁止的事件是整个字符串。 它的两半长度为 2，给出等式约束 (s_0=s_2) 和 (s_1=s_3)。 

| 活动索引 | 组件| 行动| 贡献 |
 | ---| ---| ---| ---|
 | 0 | 4 | 排除事件 | (35^4=1500625) |
 | 0 | 2 | 包括活动 | (-35^2=-1225) | (-35^2=-1225) |
 | 1 | 2 | 叶| (35^2=1225) |

 最终值为(1500625-1225=1499400)。 在包含事件后，DSU 有两个组件，因为位置 0 和 2 绑定在一起，位置 1 和 3 绑定在一起。 这与包含长度为 4 的串联重复的 (35^2) 字符串完全匹配。 

对于示例 3，输入为`15 5`。 阈值为 10，因此仅考虑偶数长度 10、12 和 14。 每个可能的起始位置都会创建一个事件，给出一小部分长相等模式。 长度递减的顺序让 DSU 在测试较短的事件之前积累强大的约束。 

| 重复长度| 可能的开始 | 每个事件的平等对 |
 | ---| ---| ---|
 | 14 | 14 0, 1 | 7 |
 | 12 | 12 0, 1, 2, 3 | 0, 1, 2, 3 | 6 |
 | 10 | 10 0、1、2、3、4、5 | 5 |

 包含-排除递归评估每个非冗余交叉点的兼容分配并取消每个冗余分支。 结果值为`911125634`，匹配示例输出。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(Bn\log n)) | (B) 是在修剪中幸存下来的递归状态的数量； 处理一个事件最多使用 (O(n)) DSU 操作 |
 | 空间| (O(nk^2)) | 有 (O(k^2)) 个事件，每个事件包含 (O(n)) 个相等对，加上回滚 DSU |

 重要的实际参数是 (B)，而不是理论参数 (2^m)。 由于 (k\le16)，只有 (O(k^2)) 个候选重复，并且从最长到最短处理它们会导致大部分分支在当前事件已经隐含时终止。 这是给定限制的预期方法。 官方教程明确描述了包含排除剪枝和有用的长度递减排序。 

## 测试用例

 以下测试使用`count_kpop`从上面的解决方案中可以得到函数。 帮助器重定向标准输入，以便断言采用与提交的程序相同的输入格式。```python
import sys
import io

MOD = 998244353

# Paste the solution's count_kpop function here,
# or import it from the submitted solution module.
from solution import count_kpop

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        n, k = map(int, input().split())
        return str(count_kpop(n, k)) + "\n"
    finally:
        sys.stdin = old_stdin

# Provided samples
assert run("1 16\n") == "35\n", "sample 1"
assert run("4 0\n") == "1499400\n", "sample 2"
assert run("15 5\n") == "911125634\n", "sample 3"

# Minimum size. No tandem repeat can exist.
assert run("1 0\n") == "35\n", "minimum size"

# All length-2 strings are tandem repeats exactly when both characters
# are equal. The answer is 35 * 34.
assert run("2 16\n") == "1190\n", "all-equal boundary"

# Odd n with k = 0. No even substring can reach length 3.
assert run("3 0\n") == "42875\n", "odd-length boundary"

# For n = 100, k = 0, only the complete length-100 string can be
# a forbidden tandem repeat.
expected = (pow(35, 100, MOD) - pow(35, 50, MOD)) % MOD
assert run("100 0\n") == f"{expected}\n", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`|`35`| 最小长度和空事件集 |
 |`2 16`|`1190`| 非常大（k），阈值变为负 |
 |`3 0`|`42875`| 奇数阈值和串联长度偶数的要求 |
 |`100 0`| (35^{100}-35^{50}\pmod{998244353}) | 最大值 (n) 和单个全长事件情况 |

 ## 边缘情况

 对于`1 16`，事件生成循环从长度 2 开始，该长度已经大于 (n)。 事件列表为空，因此 DSU 从一个组件开始，递归返回 (35^1=35)。 没有引入长度为一的人为重复。 

为了`4 0`，阈值恰好为 4。唯一生成的事件的长度为 4 和两个相等对。 include 分支将 DSU 从四个组件减少到两个，从而产生 (35^2) 个坏字符串。 包含-排除从所有 (35^4) 个字符串中减去那些，并给出`1499400`。 

为了`2 16`，阈值为负，但实现不会意外生成长度为零或一的间隔。 它从长度 2 开始，因此正好找到一个事件，要求两个位置相等。 包含的事件留下一个DSU分量，因此其贡献为(35)，结果为(35^2-35=1190)。 

为了`3 0`，阈值为 3。循环考虑从 3 到 3 的长度，但拒绝 3，因为它是奇数。 没有剩余事件，因此所有 (35^3=42875) 个字符串都被计数。 这就是为什么在事件构建期间检查奇偶性至关重要。 

对于最大尺寸的情况`100 0`，阈值为100。只有完整的字符串才能成为禁止的串联重复。 它的两半长度均为 50，因此其等式约束正好留下 50 个独立的字符选择。 结果是 (35^{100}-35^{50}) 模 (998244353)，并且递归仅包含一个事件，这使得这种情况本质上是最简单的可能的包含-排除实例，尽管有最大字符串长度。
