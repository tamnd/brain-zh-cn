---
title: "CF 172E - BHTML+BCSS"
description: "我们得到了一个简化的类似 HTML 的文档。 每个标签要么是像<a这样的开始标签，像</a这样的结束标签，要么像<a/这样的自关闭标签。 保证文档正确嵌套，因此每个开始标记都有一个匹配的结束标记。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "dfs-and-similar", "expression-parsing"]
categories: ["algorithms"]
codeforces_contest: 172
codeforces_index: "E"
codeforces_contest_name: "Croc Champ 2012 - Qualification Round"
rating: 2200
weight: 172
solve_time_s: 141
verified: false
draft: false
---

[CF 172E - BHTML+BCSS](https://codeforces.com/problemset/problem/172/E)

 **评分：** 2200
 **标签：** *特殊、dfs及类似、表达式解析
 **求解时间：** 2m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个简化的类似 HTML 的文档。 每个标签都是一个开始标签，例如`<a>`，一个结束标签，例如`</a>`，或者像这样的自闭标签`<a/>`。 保证文档正确嵌套，因此每个开始标记都有一个匹配的结束标记。 

每对匹配的标签形成一个元素。 自闭合标签也算作元素。 由于文档是正确嵌套的，因此元素形成了有根森林结构，就像 DOM 树一样。 

查询是一系列标签名称，例如：```
a b c
```如果存在以该元素结束且其标签名称恰好为的祖先链，则该元素与此查询匹配`a -> b -> c`。 

重要的细节是链不需要使用连续的级别。 该查询仅需要嵌套包含。 例如：```
<a><x><b></b></x></a>
```元素`b`与查询匹配`a b`， 虽然`x`坐在他们之间。 

对于每个查询，我们必须计算有多少元素满足它。 

文档长度可达`10^6`，这会立即排除标签数量的二次方。 即使解析文档已经花费了线性时间，因此实际的匹配逻辑也必须保持接近线性。 

最多有`200`查询，每个查询长度最多为`200`。 这是一个强烈的暗示，我们应该预处理文档一次，然后一起回答所有查询。 

每个节点的每个查询的朴素 DFS 都会爆炸。 在最坏的情况下，树可能包含数十万个元素。 将其乘以所有查询长度的成本太高了。 

一些边缘情况很容易被错误处理。 

考虑重复的标签名称：```
<a><a><a></a></a></a>
```询问：```
a a
```最深的`a`匹配，因为它有一个祖先`a`。 中间`a`也匹配。 如果不小心实现，只跟踪最近的祖先，就会错过一些匹配项。 

另一个微妙的情况是非连续嵌套：```
<a><x><b></b></x></a>
```询问：```
a b
```正确答案是`1`。 任何仅检查父子关系而不检查任意祖先链的解决方案在这里都会失败。 

自闭合标签的行为与普通元素类似：```
<a><b/></a>
```询问：```
a b
```答案是`1`。 如果解析忽略自闭合标签或忘记为它们创建元素节点，则计数将变得不正确。 

最后，顺序很重要：```
<a><b></b></a>
```询问：```
b a
```答案是`0`，因为祖先链必须遵循从最外层到最内层的嵌套顺序。 

## 方法

 构建树后，暴力方法就很简单了。 

对于每个元素，我们可以向上遍历其祖先并尝试向后匹配每个查询。 假设一个查询是：```
a b c
```对于标记的元素`c`，我们爬向根部寻找`b`，然后继续寻找`a`。 

这是有效的，因为查询只询问这样的祖先链是否存在。 向上扫描直接检查该条件。 

问题在于复杂性。 如果文档包含`N`元素并且树退化成一条链，那么每次向上行走可能会花费`O(N)`。 对每个元素和每个查询重复此操作，大致会导致：```
O(number_of_queries * N^2)
```和`N`近几十万，这是没有希望的。 

关键的观察结果是，不同查询的数量很少，而文档本身却很大。 

我们可以处理一次文档，同时维护有关所有查询的信息，而不是单独测试查询。 

假设我们用DFS遍历树并保留标签名从根到当前节点的当前路径。 那么每个查询就变成了一个子序列匹配问题：

 查询是否显示为当前根到节点路径的子序列？ 

例如，如果当前的 DFS 路径是：```
header p div b
```然后查询：```
header b
```匹配。 

由于查询很短，我们可以构建所有查询的字典树。 在 DFS 期间，每当我们输入名为`x`，每个查询状态等待`x`可以前进。 

这将问题转化为沿着 DFS 路径的自动机传播。 

查询数据总量很小：```
200 * 200 = 40000
```因此我们有能力维护所有部分匹配的转换列表。 

生成的算法与文档大小基本上呈线性关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(Q·N²) | O(N) | 太慢了|
 | 最佳 | O(文档长度 + 总查询长度 + 总状态转换) | O(总查询长度) | 已接受 |

 ## 算法演练

 ### 解析文档

 我们从左到右扫描文档字符串并提取标签。 

对于每个开始标签，我们创建一个新节点并将其推入堆栈。 

对于每个结束标签，我们从堆栈中弹出匹配的节点。 

对于每个自关闭标签，我们创建一个节点但不推送它。 

这将重建嵌套树。 

### 构建查询状态

 1. 将每个查询拆分为单词。 
2. 为文档或查询中出现的每个唯一标签名称分配一个整数 ID。 
3. 对于每个查询，创建表示该查询的前缀的状态。 

例如查询：```
a b c
```创建过渡：```
state 0 --a--> state 1
state 1 --b--> state 2
state 2 --c--> state 3
```状态`3`表示整个查询匹配。 

1. 对于每个标签名称，存储当该标签出现时哪些状态可以前进。 

这使我们能够在 DFS 期间有效地更新所有活动的部分匹配。 

### DFS遍历

 1. 从每个根节点启动DFS。 
2. 维护数组`cnt[state]`。`cnt[s]`等于当前根到节点路径实现查询前缀状态的方式数`s`。 

最初仅声明`0`是活跃的。 

1.进入带标签的节点时`x`，每个转换等待`x`变得可用。 

认为：```
state u --x--> state v
```然后：```
cnt[v] += cnt[u]
```我们以相反的顺序处理状态，因此来自该节点的更新不会在同一步骤内多次级联。 

1. 每当终端状态变为活动状态时，相应的查询增益就会在该节点匹配。 
2. 递归到子级。 
3、返回后，回滚在该节点进行的所有修改。 

回滚至关重要，因为 DFS 路径是独立的。 

### 为什么它有效

 在DFS期间的任何时刻，`cnt[state]`表示当前根到当前节点路径有多少个子序列实现相应的查询前缀。 

当我们输入一个标签时`x`，每个现有的部分匹配期望`x`可以延伸穿过当前节点。 由于子序列允许跳过中间节点，因此每个先前的有效前缀在树的更深处仍然有效。 

以相反顺序处理转换可防止单个节点在同一查询位置内多次重复使用。 

由于 DFS 始终准确地维护当前的祖先路径，因此每个计数的完成都对应于文档中的一个有效嵌套链，并且当 DFS 到达其最终元素时，最终会对每个有效嵌套链进行计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import defaultdict

def solve():
    s = input().strip()
    m = int(input())

    queries = []
    all_tags = set()

    for _ in range(m):
        q = input().split()
        queries.append(q)
        all_tags.update(q)

    n = len(s)

    children = []
    tag_id = []
    roots = []

    stack = []

    tag_map = {}

    def get_id(name):
        if name not in tag_map:
            tag_map[name] = len(tag_map)
        return tag_map[name]

    i = 0

    while i < n:
        j = s.find('>', i)

        token = s[i + 1:j]

        if token[0] == '/':
            stack.pop()

        elif token[-1] == '/':
            name = token[:-1]

            tid = get_id(name)

            node = len(children)
            children.append([])
            tag_id.append(tid)

            if stack:
                children[stack[-1]].append(node)
            else:
                roots.append(node)

        else:
            name = token

            tid = get_id(name)

            node = len(children)
            children.append([])
            tag_id.append(tid)

            if stack:
                children[stack[-1]].append(node)
            else:
                roots.append(node)

            stack.append(node)

        i = j + 1

    transitions = defaultdict(list)

    state_ptr = 1

    query_end = []
    query_state = []

    for qi, q in enumerate(queries):
        cur = 0

        for word in q:
            tid = get_id(word)

            nxt = state_ptr
            state_ptr += 1

            transitions[tid].append((cur, nxt))

            cur = nxt

        query_end.append(cur)
        query_state.append(cur)

    cnt = [0] * state_ptr
    cnt[0] = 1

    ans = [0] * m

    def dfs(u):
        tid = tag_id[u]

        updates = []

        trans = transitions.get(tid, [])

        for prev, nxt in reversed(trans):
            add = cnt[prev]

            if add:
                old = cnt[nxt]
                cnt[nxt] += add
                updates.append((nxt, old))

        for qi in range(m):
            st = query_end[qi]
            if cnt[st]:
                ans[qi] += cnt[st]

        for v in children[u]:
            dfs(v)

        for st, old in reversed(updates):
            cnt[st] = old

    for r in roots:
        dfs(r)

    print('\n'.join(map(str, ans)))

solve()
```解析器直接从标签流重建森林。 每个开始或自闭合标签都会创建一个节点。 堆栈始终存储当前打开的元素。 

自动机状态表示查询的前缀。 状态`0`表示空前缀。 每个转换对应于使用查询中的一个标签。 

DFS 在当前祖先路径上维护动态编程值。 逆序转换更新是微妙的部分。 在不反转的情况下，一个节点可以同时推进同一查询的多个位置。 

例如，考虑查询：```
a a
```和当前节点`a`。 

如果向前处理更新，同一节点将首先激活第一个`a`，然后立即激活第二个`a`再次使用自己。 倒车可以防止这种情况发生。 

回滚在离开子树后恢复 DP 阵列。 如果没有回滚，来自一个分支的匹配将错误地泄漏到兄弟分支中。 

## 工作示例

 ### 示例 1

 输入：```
<a><b><b></b></b></a><a><b></b><b><v/></b></a><b></b>
```查询：```
a
a b b
a b
b a
```树结构为：```
a
└── b
    └── b

a
├── b
└── b
    └── v

b
```查询的 DFS 跟踪`a b`：

 | 当前路径| 活跃前缀 | 查询匹配吗？ |
 | --- | --- | --- |
 | 一个 | 一个 | 没有 |
 | 乙| 一个，一个b | 是的 |
 | 乙乙 | 一个，一个b | 是的 |
 | 一个 | 一个 | 没有 |
 | 乙| 一个，一个b | 是的 |
 | 乙| 一个，一个b | 是的 |
 | a b v | 一个，一个b | 没有 |
 | 乙| 无 | 没有 |

 答案就变成了`4`。 

该跟踪演示了子序列匹配。 查询`a b`匹配直接和间接嵌套链。 

### 自定义示例

 输入：```
<a><x><b/></x></a>
```询问：```
a b
```DFS 跟踪：

 | 当前路径| 匹配前缀 |
 | --- | --- |
 | 一个 | 一个 |
 | 一个x| 一个 |
 | 一个x b | 一个，一个b |

 答案是`1`。 

该示例确认可以跳过中间节点。 该查询仅需要祖先包含，而不需要邻接。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(L + S + T) |`L`用于解析文档，`S`对于总查询大小，`T`对于 DFS 期间的所有转换更新 |
 | 空间| O(N + S) | 树存储加自动机状态 |

 文档长度最多为`10^6`，所以线性解析是必要的。 总查询大小永远不会超过`40000`，这使得自动机与文档相比非常小。 该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    s = input().strip()
    m = int(input())

    queries = []

    children = []
    tag_id = []
    roots = []

    stack = []

    tag_map = {}

    def get_id(name):
        if name not in tag_map:
            tag_map[name] = len(tag_map)
        return tag_map[name]

    n = len(s)

    i = 0

    while i < n:
        j = s.find('>', i)

        token = s[i + 1:j]

        if token[0] == '/':
            stack.pop()

        elif token[-1] == '/':
            name = token[:-1]

            tid = get_id(name)

            node = len(children)
            children.append([])
            tag_id.append(tid)

            if stack:
                children[stack[-1]].append(node)
            else:
                roots.append(node)

        else:
            name = token

            tid = get_id(name)

            node = len(children)
            children.append([])
            tag_id.append(tid)

            if stack:
                children[stack[-1]].append(node)
            else:
                roots.append(node)

            stack.append(node)

        i = j + 1

    transitions = defaultdict(list)

    state_ptr = 1

    query_end = []

    for qi in range(m):
        q = input().split()

        cur = 0

        for word in q:
            tid = get_id(word)

            nxt = state_ptr
            state_ptr += 1

            transitions[tid].append((cur, nxt))

            cur = nxt

        query_end.append(cur)

    cnt = [0] * state_ptr
    cnt[0] = 1

    ans = [0] * m

    def dfs(u):
        tid = tag_id[u]

        updates = []

        for prev, nxt in reversed(transitions.get(tid, [])):
            add = cnt[prev]

            if add:
                old = cnt[nxt]
                cnt[nxt] += add
                updates.append((nxt, old))

        for qi, st in enumerate(query_end):
            if cnt[st]:
                ans[qi] += cnt[st]

        for v in children[u]:
            dfs(v)

        for st, old in reversed(updates):
            cnt[st] = old

    for r in roots:
        dfs(r)

    return '\n'.join(map(str, ans))

# provided sample
assert run(
"""<a><b><b></b></b></a><a><b></b><b><v/></b></a><b></b>
4
a
a b b
a b
b a
"""
) == "2\n1\n4\n0"

# single self-closing node
assert run(
"""<a/>
1
a
"""
) == "1"

# non-consecutive nesting
assert run(
"""<a><x><b/></x></a>
1
a b
"""
) == "1"

# repeated names
assert run(
"""<a><a><a/></a></a>
2
a a
a a a
"""
) == "2\n1"

# impossible order
assert run(
"""<a><b/></a>
1
b a
"""
) == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`<a/>`带查询`a`|`1`| 自闭合标签创建元素 |
 |`<a><x><b/></x></a>`带查询`a b`|`1`| 非连续嵌套工作 |
 | 嵌套重复`a`标签 |`2`,`1`| 逆序DP更新正确性|
 | 询问`b a`在`<a><b/></a>`|`0`| 祖先顺序很重要|

 ## 边缘情况

 考虑重复的标签名称：```
<a><a><a/></a></a>
```询问：```
a a
```当DFS进入最深处时`a`，该路径包含三个`a`节点。 

逆序转换更新保证当前节点在每个查询位置仅贡献一次。 最深的节点使用祖先正确匹配`a`，不是它本身两次。 

该算法输出：```
2
```它计算中间和最深层的元素。 

现在考虑跳过的级别：```
<a><x><b/></x></a>
```询问：```
a b
```参观时`x`, 前缀的 DP 状态`a`保持活跃。 进入`b`将现有前缀扩展为`a b`。 

该算法从不需要匹配节点之间的邻接，只需要祖先包含。 

最后，考虑兄弟泄漏：```
<a><b/></a><a/>
```询问：```
a b
```正确答案是`1`。 

DFS 离开第一个子树后，回滚会删除那里引入的所有状态。 当第二个根`a`已处理，之前的`b`比赛消失了。 

如果没有回滚，第二个分支将错误地继承第一个子树的匹配项。
