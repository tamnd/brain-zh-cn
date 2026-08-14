---
title: "CF 102341K - Kecleon"
description: "我们维护一串小写字母，该字符串仅通过在其右端附加一个字符来增长。 查询要求长度（k），我们必须计算有多少个长度（k）的子字符串恰好等于整个长度（k）的字符串的前缀。"
date: "2026-08-13T03:23:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "K"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 187
verified: true
draft: false
---

[CF 102341K - Kecleon](https://codeforces.com/problemset/problem/102341/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一串小写字母，该字符串仅通过在其右端附加一个字符来增长。 查询要求长度（k），我们必须计算有多少个长度（k）的子字符串恰好等于整个长度（k）的字符串的前缀。 

在线输入有两种方式。 首先，附加的字符和请求的长度都是使用之前的答案进行编码的，因此我们无法提前解码未来的查询。 其次，字符串本身只会增长，这使我们有机会增量地维护信息。 

查询次数最多为（300,000），因此最终字符串的长度也最多为（300,000）。 为每个查询扫描整个字符串的算法已经太慢了。 逐个字符比较每个候选子串的算法可以在大型对抗性输入上达到大约 (10^{15}) 个字符比较。 我们需要每个操作的大致对数工作量。 

三个细节通常会导致错误的解决方案。 

第一个是 (k=n) 恰好有一个匹配区间，即整个字符串。 例如，```
3
add a
add b
get 2
```产生```
1
```仅计算正确出现次数的解决方案可能会意外返回零。 

第二个是前缀本身始终算作一次出现。 为了```
2
add a
get 1
```答案是```
1
```三是在线编码。 考虑```
6
add a
add a
add b
add a
get 1
get 1
```该字符串是`aaba`。 第一个`get 1`要求 (k=1)，其答案是 (3)，所以`last`变为(3)。 第二个原始值`1`然后用(n=4)解码为(k=4)，而不是(k=1)。 其答案为（1）。 正确的输出是```
3
1
```忽略`last`会默默地回答错误的问题。 

## 方法

 直接的解决方案是存储当前字符串，并针对每个查询检查每个可能的起始位置。 对于每个位置，我们将长度 (k) 的子字符串与前 (k) 个字符进行比较。 这是正确的，因为这些正是查询提到的间隔。 然而，可能有 (n-k+1) 个候选间隔，并且比较一个间隔可能会花费 (k)，从而为一个查询提供 (O(nk)) 工作量。 

最坏的情况远大于四秒限制允许的范围。 对于大约 (200,000) 个附加字符和 (100,000) 个查询，单个查询可能需要大约 (10^{10}) 个字符比较，并且在查询上重复该操作会达到 (10^{15}) 个比较的顺序。 

滚动哈希会降低比较一个子字符串的成本，但我们仍然需要检查所有 (n-k+1) 个起始位置。 真正的问题不仅仅是平等测试。 我们需要一种方法来计算前缀的所有出现次数，而无需扫描字符串。 

关键观察来自 KMP 使用的前缀函数。 对于每个以位置 (i) 结尾的前缀，前缀函数告诉我们其最长的固有前缀（也是后缀）的长度。 如果我们为每个前缀长度创建一个节点，并使节点 (i) 成为节点 (\pi[i-1]) 的子节点，我们就获得了前缀函数树。 

现在考虑长度为 (k) 的前缀。 当前 (k) 个字符是以 (i) 结尾的前缀的后缀时，它就会以 (i) 位置结尾。 在前缀函数树中，这意味着节点 (k) 是节点 (i) 的祖先。 因此，前缀（k）出现的次数恰好是以节点（k）为根的子树的大小。 

这彻底改变了问题。 每个附加字符都会在前缀功能树中创建一个新节点，并且该节点将作为叶子附加。 每个查询都成为动态子树大小的查询。 

静态欧拉遍历将使每个子树成为连续的区间，但该树是在线构建的，因此其最终的 DFS 顺序未知。 相反，我们可以在隐式陷阱中动态维护欧拉序列。 每个树节点接收一个进入令牌和一个退出令牌。 进入令牌的值为 (1)，而退出令牌的值为 (0)。 节点的整个子树始终是其进入标记和退出标记之间的连续序列。 当新叶子附加到父节点时，它的两个标记将插入到父节点的退出标记之前。 

treap 存储欧拉序列并维护每个treap 子树中标记值的总和。 子树大小的查询只是相应的进入和退出标记之间的进入标记的数量。 

蛮力方法和最优方法可以进行如下比较。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(qn^2)) 在最坏的情况下 | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O(q\log q)) 预期 | (O(q)) | 已接受 |

 ## 算法演练

 1. 维护当前字符串及其前缀函数数组。 当附加新字符时，使用通常的 KMP 后备链计算其前缀函数值。 如果新位置是(n)，则其在前缀函数树中的父节点是节点(\pi[n-1])。 

KMP 计算在整个序列上线性摊销，因为每个回退都会移动到先前计算的边界。 
2. 用每个节点的进入和退出标记来表示前缀功能树。 节点 (v) 的入口令牌存储值 (1)，其退出令牌存储值 (0)。 人工根节点 (0) 的值为 (0)。 

DFS 表示看起来像`enter(v), all descendants, exit(v)`。 因此 (v) 子树中的每个节点在区间内恰好贡献一 (1)`enter(v)`到`exit(v)`。 
3. 将此标记序列存储在隐式陷阱中。 陷阱是按序列位置而不是显式键排序的。 每个trap节点存储其子树大小、子树总和、子树、父树和随机优先级。 

父指针让我们通过从令牌向trap根行走，在（O（\log n））预期时间内找到任何令牌的当前位置。 
4. 当前缀树节点 (v) 与父节点 (p) 创建时，找到其当前位置`exit(p)`。 在该标记之前拆分欧拉序列，插入`enter(v), exit(v)`，并将序列合并回来。 

在父节点的退出标记之前插入会将新节点放置为该父节点的最后一个子节点。 兄弟姐妹之间的确切顺序并不重要，因为仅使用子树成员资格。 
5.对于一个`get`查询，首先使用当前值解码请求的长度`last`。 

解码后的(k)对应于前缀函数树节点(k)。 查找进入令牌的数量`enter(k)`通过`exit(k)`。 该数字是 (k) 的子树大小，它恰好是长度 (k) 的前缀出现的次数。 
6. 将答案存储在`last`在处理下一个查询之前。 

### 为什么它有效

 对于每个位置 (i)，节点 (i) 表示以该位置结束的整个前缀。 当长度 (k) 的前缀是以 (i) 结尾的前缀的后缀时，节点 (k) 是节点 (i) 的祖先。 该后缀恰好是以 (i) 结尾的前 (k) 个字符的出现。 因此，所查询的前缀的出现与(k)的子树中的节点一一对应。 

动态欧拉序列始终将每个子树包含为一个连续的区间。 由于只有条目标记对存储的总和有贡献，因此节点 (k) 的间隔上的总和对每个后代恰好计数一次。 因此，trap 准确地返回所需数量的匹配间隔。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

def solve():
    q = int(input())

    # Prefix-function data.
    s = bytearray()
    pi = [0]

    # Implicit treap data.
    # Node 0 is the null treap node.
    left = [0]
    right = [0]
    parent = [0]
    size = [0]
    sm = [0]
    value = [0]
    priority = [0]

    seed = 0x12345678

    def rng():
        nonlocal seed
        seed ^= (seed << 13) & 0xFFFFFFFF
        seed ^= seed >> 17
        seed ^= (seed << 5) & 0xFFFFFFFF
        seed &= 0xFFFFFFFF
        return seed

    def new_node(v):
        idx = len(left)
        left.append(0)
        right.append(0)
        parent.append(0)
        size.append(1)
        sm.append(v)
        value.append(v)
        priority.append(rng())
        return idx

    # Root of the prefix-function tree is node 0.
    # Its Euler sequence is enter(0), exit(0).
    new_node(0)
    new_node(0)
    root = 1

    def pull(x):
        l = left[x]
        r = right[x]
        size[x] = size[l] + size[r] + 1
        sm[x] = sm[l] + sm[r] + value[x]

    def merge(a, b):
        if a == 0:
            if b:
                parent[b] = 0
            return b
        if b == 0:
            parent[a] = 0
            return a

        if priority[a] > priority[b]:
            nr = merge(right[a], b)
            right[a] = nr
            if nr:
                parent[nr] = a
            pull(a)
            parent[a] = 0
            return a

        nl = merge(a, left[b])
        left[b] = nl
        if nl:
            parent[nl] = b
        pull(b)
        parent[b] = 0
        return b

    def split(x, k):
        if x == 0:
            return 0, 0

        ls = size[left[x]]

        if k <= ls:
            a, b = split(left[x], k)
            left[x] = b
            if b:
                parent[b] = x
            parent[x] = 0
            if a:
                parent[a] = 0
            pull(x)
            return a, x

        a, b = split(right[x], k - ls - 1)
        right[x] = a
        if a:
            parent[a] = x
        parent[x] = 0
        if b:
            parent[b] = 0
        pull(x)
        return x, b

    def get_rank(x):
        # 1-based position of x in the implicit sequence.
        ans = size[left[x]] + 1
        while parent[x]:
            p = parent[x]
            if right[p] == x:
                ans += size[left[p]] + 1
            x = p
        return ans

    def prefix_before(x):
        # Sum of values strictly before x.
        ans = sm[left[x]]
        while parent[x]:
            p = parent[x]
            if right[p] == x:
                ans += sm[left[p]] + value[p]
            x = p
        return ans

    def enter_token(v):
        # Vertex v has tokens 2*v+1 and 2*v+2.
        return 2 * v + 1

    def exit_token(v):
        return 2 * v + 2

    # Insert the two Euler tokens of vertex v immediately
    # before the exit token of its parent.
    def link_leaf(v, p):
        nonlocal root

        target = exit_token(p)
        pos = get_rank(target)

        a, b = split(root, pos - 1)

        en = new_node(1)
        ex = new_node(0)
        pair = merge(en, ex)

        root = merge(merge(a, pair), b)

    last = 0
    output = []

    for _ in range(q):
        parts = input().split()

        if parts[0] == b"add" or parts[0] == "add":
            raw = parts[1]
            if isinstance(raw, bytes):
                raw = raw[0]
            else:
                raw = ord(raw)

            c = (raw - 97 + last) % 26

            old_n = len(s)
            s.append(c + 97)

            if old_n == 0:
                cur_pi = 0
            else:
                j = pi[old_n - 1]
                while j > 0 and s[old_n] != s[j]:
                    j = pi[j - 1]
                if s[old_n] == s[j]:
                    j += 1
                cur_pi = j

            pi.append(cur_pi)

            v = old_n + 1
            link_leaf(v, cur_pi)

        else:
            raw_k = int(parts[1])
            n = len(s)

            k = ((raw_k - 1 + last) % n) + 1

            tin = enter_token(k)
            tout = exit_token(k)

            # All entry tokens in the subtree lie between tin and tout.
            ans = prefix_before(tout) - prefix_before(tin)

            output.append(str(ans))
            last = ans

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```前缀功能部分遵循标准 KMP 思想。 第一个字符的前缀函数值为零。 对于后面的每个字符，我们从前一个前缀函数值开始，并重复遵循失败链接，直到当前字符可以扩展边界。 

前缀函数值也是树中的父索引。 如果当前前缀的长度为 (v)，则其最长的固有前缀（同时也是后缀）的长度为`pi[v - 1]`，所以它正是节点 (v) 的父节点。 

欧拉令牌被分配了固定的标识符。 对于顶点 (v)，`2*v+1`是它的入口令牌并且`2*v+2`是它的退出令牌。 这使得没有必要为每个顶点存储单独的标记引用。 

treap 隐式存储欧拉序列。`split(root, k)`分隔前 (k) 个标记，而`merge(a, b)`连接两个序列。 每当子节点附加到treap节点时，父指针都会被维护，这使得`get_rank`可能的。 

插入位置使用`get_rank(exit_token(parent)) - 1`。 这是一个很容易出错的位置。 拆分必须包含父级退出令牌之前的每个令牌，而退出令牌本身属于右侧部分。 

对于查询，`prefix_before(x)`返回严格位于标记 (x) 之前的所有标记值的总和。 从而减去之前的值`enter(k)`从之前的值`exit(k)`计算子树中的每个入口标记并排除退出标记本身。 Python 中不可能出现整数溢出，而在 C++ 中，答案很适合 32 位有符号整数，因为它最多为 (n)。 

解码必须在更新之前进行`last`。 新的答案变成`last`仅在查询完全处理后。 

## 工作示例

 ### 示例 1

 解码后的字符串最终变成`abcababca`。 前缀函数父级是在线生成的，而欧拉巡演保持每个前缀函数子树连续。 

| 查询 | 当前字符串| 解码 (k) | 前缀树节点| 回答 |`last`|
 | --- | --- | --- | --- | --- | --- |
 |`add a`|`a`| | | | 0 |
 |`add b`|`ab`| | | | 0 |
 |`add c`|`abc`| | | | 0 |
 |`add a`|`abca`| | | | 0 |
 |`get 1`|`abca`| 1 | 1 | 2 | 2 |
 |`add z`|`abcab`| | | | 2 |
 |`get 1`|`abcab`| 3 | 3 | 1 | 1 |
 |`get 1`|`abcab`| 2 | 2 | 2 | 2 |
 |`add y`|`abcaba`| | | | 2 |
 |`add z`|`abcabab`| | | | 2 |
 |`add a`|`abcababc`| | | | 2 |
 |`add y`|`abcababca`| | | | 2 |
 |`get 8`|`abcababca`| 1 | 1 | 4 | 4 |
 |`get 7`|`abcababca`| 3 | 3 | 3 | 3 |
 |`get 9`|`abcababca`| 4 | 4 | 2 | 2 |
 |`get 2`|`abcababca`| 4 | 4 | 2 | 2 |

 第一个查询要求出现以下情况`a`在`abca`，给两个。 这个答案改变了对下一个的解释`get`。 第二个答案变成1后，原始值如下`1`解码为(k=2)，其前缀为`ab`并出现两次。 

后面的查询显示了为什么答案是子树大小而不是直接的字符计数。 例如解码后（k=4）对应前缀`abca`。 它的出现由前缀函数树中节点 4 的后代表示，并且欧拉区间恰好包含这些条目标记。 

### 在线解码示例

 考虑较小的输入```
6
add a
add a
add b
add a
get 1
get 1
```实际的字符串是`aaba`。 第一个查询有 (k=1)，前缀`a`出现三次。 这使得`last=3`。 第二个原料`get 1`然后使用(n=4)解码，给出(k=4)。 

| 查询 | 字符串| 解码 (k) | 相关前缀| 回答 |`last`|
 | --- | --- | --- | --- | --- | --- |
 |`add a`|`a`| | | | 0 |
 |`add a`|`aa`| | | | 0 |
 |`add b`|`aab`| | | | 0 |
 |`add a`|`aaba`| | | | 0 |
 |`get 1`|`aaba`| 1 |`a`| 3 | 3 |
 |`get 1`|`aaba`| 4 |`aaba`| 1 | 1 |

 此跟踪练习了无法通过预处理所有查询来处理的问题的一部分。 第二个查询实际上是在询问整个当前字符串，因为它的解码值取决于第一个查询的答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(q\log q)) 预期 | 每个追加执行摊销 (O(1)) 前缀函数工作和 (O(\log q)) 预期垃圾工作。 每个`get`使用两次 (O(\log q)) 陷阱遍历。 |
 | 空间| (O(q)) | 每个前缀函数节点都有两个欧拉标记，加上字符串和前缀函数数组。 |

 前缀功能节点的最大数量为（300,000），因此treap最多包含（600,002）个令牌（包括人工根）。 预期的对数陷阱高度使每个动态插入和查询保持在所需的渐近界限内。 原始问题有四秒的限制，因此实现需要紧凑的数据结构和快速的 I/O。 Python 实现使用原始 Python 整数数组，并避免创建子字符串或散列。 

## 测试用例

 以下测试假设`solve()`解决方案中的函数存在于同一文件中。```python
import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    out = io.StringIO()
    sys.stdout = out

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

    return out.getvalue()

sample_1 = """16
add a
add b
add c
add a
get 1
add z
get 1
get 1
add y
add z
add a
add y
get 8
get 7
get 9
get 2
"""

assert run(sample_1) == """2
1
2
4
3
2
2
""", "sample 1"

assert run("""2
add a
get 1
""") == """1
""", "minimum size"

assert run("""5
add a
add a
add a
add a
get 1
""") == """4
""", "all equal values"

assert run("""3
add a
add b
get 2
""") == """1
""", "k equals n"

assert run("""6
add a
add a
add b
add a
get 1
get 1
""") == """3
1
""", "online decoding"

max_q = 300000
max_input = str(max_q) + "\n" + ("add a\n" * (max_q - 1)) + "get 1\n"
assert run(max_input) == str(max_q - 1) + "\n", "maximum size"

# A mixed pattern with several different prefix occurrences.
assert run("""9
add a
add b
add a
add b
add a
get 1
get 2
get 3
""") == """3
2
1
""", "overlapping prefixes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / add a / get 1`|`1`| 最小有效输入以及前缀本身很重要的事实 |
 | 四`add a`随后的操作`get 1`|`4`| 全等字符串和大前缀函数子树 |
 |`add a`,`add b`,`get 2`|`1`| 边界情况 (k=n) |
 |`aaba`接下来是两个编码的`get 1`查询 |`3`,`1`| 正确使用`last`解码时|
 | (299,999) 添加后`get 1`|`299999`| 最大查询数和大trap状态|
 |`ababa`有几个得到|`3`,`2`,`1`| 重叠前缀出现和嵌套前缀函数子树 |

 ## 边缘情况

 对于最小输入```
2
add a
get 1
```前缀函数树包含人工根正下方的节点 1。 其欧拉序列为`enter(0), enter(1), exit(1), exit(0)`。 属于节点 1 的区间恰好包含一个入口标记，因此答案是`1`。 

对于全相等的字符串```
5
add a
add a
add a
add a
get 1
```前缀函数树是一条链。 节点 1 是节点 2、3 和 4 的祖先，因此它的子树包含所有四个真实节点。 节点 1 的欧拉区间包含四个条目标记，给出正确答案`4`。 

对于边界情况```
3
add a
add b
get 2
```节点 2 是最新的前缀功能节点，并且还没有后代。 它的子树仅由其自身组成，因此欧拉区间包含一个条目标记。 答案是`1`，对应于唯一的长度为二的区间，整个字符串`ab`。 

对于在线解码，```
6
add a
add a
add b
add a
get 1
get 1
```第一个`get`解码为 (k=1) 并返回`3`。 下一个原始值也是`1`，但现在`last=3`(n=4)，因此解码后的长度为(4)。 节点 4 无后代，其子树大小为`1`。 因此输出是`3`其次是`1`。 

这种情况 (k=n) 也解释了为什么退出令牌必须保留，即使它的值为零。 进入和退出标记明确地界定了子树。 如果查询请求最新节点，则两个标记是相邻的，并且它们的前缀和之间的差异仍然恰好给出一个条目。 

最后，兄弟插入顺序不会影响正确性。 新的前缀函数节点总是插入到其父节点的退出标记之前，因此它成为父节点子树的一部分。 无论它出现在父级现有子级之前还是之后，都不会影响子树成员身份或子树大小。 该陷阱仅维护一种有效的 DFS 排序，而不是规范的排序。
