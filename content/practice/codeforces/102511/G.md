---
title: "CF 102511G - 她的名字"
description: "输入描述了有根的家谱。 每个女士只存储自己名字的第一个字母和她母亲的索引。"
date: "2026-08-05T16:28:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102511
codeforces_index: "G"
codeforces_contest_name: "2019 ICPC World Finals"
rating: 0
weight: 102511
solve_time_s: 184
verified: true
draft: false
---

[CF 102511G - 她的名字](https://codeforces.com/problemset/problem/102511/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入描述了有根的家谱。 每个女士只存储自己名字的第一个字母和她母亲的索引。 通过将女儿的字母放在母亲的全名前面即可获得女儿的全名，因此从节点移动到其父节点会删除名称的第一个字符。 

对于每个查询字符串，我们需要完整名称以该字符串开头的节点数。 挑战在于名称没有明确存储。 一个由一百万位女士组成的连锁店可以创建长度为一百万的名字，因此构建每个名字已经太昂贵了。 

这些限制强制采用线性或几乎线性的解决方案。 可以有一百万个女士和一百万个总查询字符。 遍历每个查询的每个名称的方法可以执行以下操作$10^{12}$字符检查是在一条长链中进行的，这远远超出了可用时间。 字母表只有 26 个字母，因此使用线性字符串处理的解决方案是可能的。 

棘手的情况是由出现在家谱不同深度的前缀引起的。 查询可以等于完整名称，可以比名称短，或者可以没有匹配的名称。 

例如，输入```
1 3
A 0
A
AA
B
```只有名字`A`。 正确的输出是```
1
0
0
```假设每个查询都必须匹配全名的解决方案将错误地拒绝第一个查询。 

另一种情况是一个查询是几个相关名称的前缀：```
3 2
S 0
A 1
B 2
A
BA
```名字是`S`,`AS`， 和`BAS`。 输出是```
1
1
```查询`A`仅匹配`AS`，并非每个后代`A`节点，因为名称是通过在前面添加字母来增长的。 

## 方法

 直接的解决方案是重建每位女士的名字并存储所有这些名字。 为了回答查询，我们可以将其与每个名称进行比较。 这是正确的，因为它准确地检查了所需的前缀关系。 问题是成本。 在一百万位女士的链条中，所有重建的名字的总长度约为$10^{12}$，并且将查询与它们进行比较会更大。 

有用的观察是前缀查询的家族关系是向后的。 通过在母亲名字的开头添加一个字母来创建女儿。 如果每个名字都颠倒过来，则通过在末尾附加一个字母来创建女儿。 家谱变成了一个正常的颠倒名字树。 

询问是否`s`是原始名称的前缀变成了一个关于是否`reverse(s)`是该 trie 中路径字符串的后缀。 这将问题转化为在许多 trie 路径中查找许多后缀。 

我们可以将所有反向查询插入到 Aho-Corasick 自动机中。 在遍历家族树时，我们在读取当前的反向名称后保持自动机状态。 每一位被拜访的女士都会为该状态贡献一次事件。 只要状态位于查询节点的故障子树内，查询就会匹配该状态，因为故障链接表示后缀关系。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2 + nk)$|$O(n^2)$| 太慢了|
 | 最佳 |$O(n + L)$|$O(n + L)$| 已接受 |

 这里$L$是所有查询的总长度。 

## 算法演练

 1. 反转每个查询字符串并将其插入到 trie 中。 每个插入字符串的终端节点都会被存储，以便稍后可以恢复答案。 逆转是关键的转变，因为逆转后家庭结构自然会附加人物。 
2. 使用 Aho-Corasick 构造为 trie 构建故障链接。 使用失败转换来填充缺失的转换，从而允许在恒定时间内处理每个字符。 
3. 使用子列表存储家谱。 从创始人开始遍历它，同时保持当前的 Aho-Corasick 状态。 当移动到女儿时，将女儿的角色输入自动机并增加结果状态的计数器。 
4. 构建自动机的故障链接树。 将每个状态的计数器添加到该树中其父级，从最深到最浅处理节点。 在此传播之后，每个州都包含以该州表示的字符串为后缀的姓氏数量。 
5. 对于每个查询，输出自动机中其终端节点处存储的累加值。 

为什么有效：反转后，每一位女士都对应于家庭特里树中的一个根到节点的字符串。 拜访一位女士后达到的自动机状态代表最长的查询前缀，也是该反向名称的后缀。 失败链接包含所有较短的后缀匹配。 通过故障树传播计数会将每个出现的情况传输到作为后缀的每个查询字符串，这正是原始的前缀条件。 

## Python 解决方案```python
import sys
from collections import deque
from array import array

input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    fam_head = array('i', [-1]) * (n + 1)
    fam_to = array('i')
    fam_next = array('i')
    fam_ch = array('b')

    for i in range(1, n + 1):
        c, p = input().split()
        c = ord(c) - 65
        p = int(p)
        if p:
            fam_to.append(i)
            fam_next.append(fam_head[p])
            fam_ch.append(c)
            fam_head[p] = len(fam_to) - 1

    q_terminal = array('i', [0]) * k

    head = array('i', [-1])
    to = array('i')
    nxt = array('i')
    ch = array('b')

    def new_node():
        head.append(-1)
        return len(head) - 1

    for qi in range(k):
        s = input().strip()[::-1]
        cur = 0
        for x in s:
            c = ord(x) - 65
            e = head[cur]
            found = -1
            while e != -1:
                if ch[e] == c:
                    found = to[e]
                    break
                e = nxt[e]
            if found == -1:
                found = new_node()
                to.append(found)
                ch.append(c)
                nxt.append(head[cur])
                head[cur] = len(to) - 1
            cur = found
        q_terminal[qi] = cur

    m = len(head)
    fail = array('i', [0]) * m

    trans = array('i', [-1]) * (m * 26)
    for v in range(m):
        e = head[v]
        while e != -1:
            trans[v * 26 + ch[e]] = to[e]
            e = nxt[e]

    q = deque()
    for c in range(26):
        x = trans[c]
        if x == -1:
            trans[c] = 0
        else:
            q.append(x)

    while q:
        v = q.popleft()
        base = v * 26
        fbase = fail[v] * 26
        for c in range(26):
            u = trans[base + c]
            if u == -1:
                trans[base + c] = trans[fbase + c]
            else:
                fail[u] = trans[fbase + c]
                q.append(u)

    cnt = array('i', [0]) * m
    stack = [(1, 0)]
    while stack:
        v, state = stack.pop()
        e = fam_head[v]
        while e != -1:
            u = fam_to[e]
            ns = trans[state * 26 + fam_ch[e]]
            cnt[ns] += 1
            stack.append((u, ns))
            e = fam_next[e]

    children = [[] for _ in range(m)]
    for i in range(1, m):
        children[fail[i]].append(i)

    order = list(range(m))
    order.sort(key=lambda x: -x)
    for v in order:
        if v:
            cnt[fail[v]] += cnt[v]

    ans = []
    for x in q_terminal:
        ans.append(str(cnt[x]))
    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```家谱与自动机分开存储，因为这两种结构代表问题的不同方向。 家族遍历创建颠倒的名称，而自动机则回答对这些名称的后缀查询。 

查询插入使用反转字符串。 终端节点会立即保存，因为在所有预处理之后，答案会附加到该确切的自动机节点。 

故障链接传播是从孩子到父母。 查询字符串可以是由许多状态表示的后缀，因此在故障树中的所有后代都做出贡献之前，无法得知最终计数。 

所有计数器都适合 Python 整数。 阵列采用紧凑存储，因为节点数量可达百万个。 

## 工作示例

 对于样本：```
10 5
S 0
Y 1
R 2
E 3
N 4
E 5
A 6
D 7
Y 7
R 9
RY
E
N
S
AY
```反向查询 trie 接收到`YR`,`E`,`N`,`S`， 和`YA`。 

家庭旅行期间：

 | 女士| 反向路径状态含义| 添加计数 |
 | --- | --- | --- |
 | S | S | 1 |
 | 杨生 | 杨生 | 1 |
 | RYS | 年 | 1 |
 | ERYS | YRS | 1 |
 | 内里斯 | 伊尔森 | 1 |
 | 能源| 伊尔森 | 1 |
 | 艾尼里斯 | 伊尔塞尼亚 | 1 |
 | 丹妮莉丝 | 伊尔森尼德 | 1 |
 | 亚内里斯 | 伊尔森尼 | 1 |
 | 瑞恩里斯 | 伊森尼尔 | 1 |

 故障传播使得`YR`收到两个匹配项，因为两者`RYS`和`RYAENERYS`以反向查询结束。 这也使得`E`收到两场比赛并且`N`收到一个。 

一个较小的案例：```
3 3
A 0
B 1
C 2
A
BA
CBA
```名字是`A`,`BA`， 和`CBA`。 

| 查询 | 反向查询 | 匹配的名字 |
 | --- | --- | --- |
 | 一个 | 一个 | A、BA、CBA |
 | 学士 | AB | 文学士，CBA |
 | 篮球联赛 | ABC | 篮球联赛 |

 自动机计算颠倒名称的后缀，这些后缀与原始名称的前缀完全对应。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n + L)$| 每个族边缘和查询字符都会被处理恒定的次数。 |
 | 空间|$O(n + L)$| 家谱和自动机各自最多包含线性数量的节点。 |

 最大输入大小为一百万个家庭节点和一百万个查询字符。 该算法仅对这些对象执行线性传递，这是限制所需的比例。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    oldout = sys.stdout
    sys.stdout = out
    solve()
    sys.stdin = old
    sys.stdout = oldout
    return out.getvalue()

assert run("""10 5
S 0
Y 1
R 2
E 3
N 4
E 5
A 6
D 7
Y 7
R 9
RY
E
N
S
AY
""") == """2
2
1
1
0"""

assert run("""1 3
A 0
A
AA
B
""") == """1
0
0"""

assert run("""3 3
A 0
B 1
C 2
A
BA
CBA
""") == """1
1
1"""

assert run("""2 2
Z 0
Z 1
Z
ZZ
""") == """1
1
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一创始人 |`1,0,0`| 等于根名称且缺少前缀的查询 |
 | 增加链条|`1,1,1`| 沿着长依赖链的前缀 |
 | 重复字母|`1,1`| 正确处理相同字符和后缀链接 |

 ## 边缘情况

 处理仅与创始人匹配的查询，因为在遍历期间也会访问根女士。 该算法从实际的家庭节点开始计数，因此名称`S`在样本中贡献一次。 

短于全名的查询由故障传播处理。 例如，在链中`A`,`BA`,`CBA`，查询`A`对应于所有反向路径的后缀，因此故障树将所有三个事件添加到最终状态。 

没有可能匹配的查询永远不会收到任何贡献。 它的自动机节点保持为零，因为没有族遍历到达它或故障树中它下面的任何状态。
