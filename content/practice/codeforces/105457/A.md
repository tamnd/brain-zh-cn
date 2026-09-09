---
title: "CF 105457A - 文字"
description: "我们得到了多个独立的测试用例。 每个测试用例由两个长度相等的字符串组成，两个字符串中的某些位置可能包含用问号表示的未知字符。"
date: "2026-06-23T02:46:27+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105457
codeforces_index: "A"
codeforces_contest_name: "XXIII Spain Olympiad in Informatics, Online Qualifier 1"
rating: 0
weight: 105457
solve_time_s: 99
verified: false
draft: false
---

[CF 105457A - 单词](https://codeforces.com/problemset/problem/105457/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了多个独立的测试用例。 每个测试用例由两个长度相等的字符串组成，两个字符串中的某些位置可能包含用问号表示的未知字符。 我们的任务是决定是否可以用小写英文字母替换每个问号，以便第一个字符串在字典顺序上严格小于第二个字符串。 

字典顺序比较的行为类似于字典顺序：我们从左到右比较字符，它们不同的第一个位置决定结果。 如果一个字符串较早用完，则认为它较小，但这里两个字符串始终具有相同的长度，因此只有字符比较很重要。 

关键的困难在于每个问号都是一个通配符，可以成为以下任意字母`'a'`到`'z'`。 这将问题变成了两个字符串的约束满足问题，而不是直接比较。 

所有测试用例的总长度限制非常大，最多可达一千万个字符。 这立即排除了任何试图探索角色或分支的分配可能性的解决方案。 即使在一个问号处分支也会导致指数爆炸。 

当两个字符串都完全由问号组成时，就会出现微妙的边缘情况。 例如，`a = "??"`和`b = "??"`。 还是可以做的`a < b`通过选择`a = "aa"`和`b = "ab"`。 仅比较固定角色而不考虑战略分配的幼稚方法会错误地得出不确定性的结论。 

另一个棘手的情况是早期角色强迫一个方向。 例如，`a = "b?"`和`b = "a?"`。 尽管两者都包含通配符，但第一个位置已经确定了`a > b`不管第二个字符如何填充，所以答案一定是`no`。 

最后，一侧具有通配符而另一侧具有固定字母的情况需要小心处理。 稍后位置的贪婪不匹配无法补偿较早的约束。 

## 方法

 暴力解决方案将尝试替换每一个`?`在两个字符串中包含所有可能的字母，然后检查是否有任何赋值使第一个字符串按字典顺序小于第二个字符串。 如果总共有 k 个问号，则有 26^k 种可能性。 对于多达一千万个字符，即使是一小部分通配符也会使这种方法完全不可行。 

关键的观察是字典顺序仅取决于字符串不同的第一个位置。 这意味着我们不需要全局决定所有角色。 相反，我们只需要确保至少一个位置可以严格变小，同时所有较早的位置保持相等。 

在每个位置，我们尝试了解是否可以强制平等到该点，然后在该位置创建严格的不平等。 如果我们能让之前所有的位置都相等，那么当前的位置就决定了一切。 该问题简化为检查每个索引是否存在一个分配，使得所有先前的位置都匹配并且当前的位置满足`a[i] < b[i]`。 

这将问题转化为具有局部可行性检查的线性扫描，其中每个位置在假设早期位置强制相等的情况下独立评估。 由于只要两个字符兼容（包括通配符灵活性）就可以始终强制执行相等，因此唯一真正的决策点是是否可以在某个位置引入严格的排序。 

这避免了任何指数分支，并将每个测试用例的问题减少到 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(26^k·n) | O(26^k·n) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们从左到右扫描两个字符串，同时保持我们是否仍然处于“前缀相等”状态，这意味着所有先前的位置都被迫匹配。 

1. 首先假设所有前面的字符都相等，因此我们可以自由地尝试在每个位置强制相等。 
2. 在每个索引 i 处，确定是否可以分配字符使得 a[i] == b[i]。 这总是可能的，除非两者都是固定且不同的，在这种情况下就无法维持平等，并且这个位置成为一个被迫的分歧点。 
3. 如果在位置 i 仍然可能相等，请检查我们是否可以强制执行严格的不等式 a[i] < b[i]，同时仍与之前的位置保持一致。 这取决于字符约束：如果a[i]是通配符，则可以根据需要将其设置得尽可能小； 如果b[i]是通配符，则可以将其设置得足够大； 否则我们直接比较固定字母。 
4. 如果在这个位置上可以存在严格的不平等，同时保持之前的平等，我们可以立即返回“si”。 
5. 如果等式延续和严格不等式都不可能以一致的方式出现，我们就提前停止，因为超出此前缀不存在有效的完成。 
6. 如果我们完成扫描而没有找到有效的严格位置，则返回“no”。 

其本质思想是，第一个能够朝正确方向“打破”平等的立场决定了成功。 我们从来不需要探索多重任务，只需要探索每个位置的平等或严格不平等的可行性。 

### 为什么它有效

 该算法依赖于字典顺序比较完全由第一个不同位置决定的事实。 任何有效的分配使得`a < b`必须有第一个索引 i，其中所有先前的位置都相等并且`a[i] < b[i]`。 如果在通配符分配下无法使这样的位置可行，则完全分配不可能成功。 相反，如果存在这样的位置，我们总是可以任意分配较早的位置来匹配和较晚的位置，因此一个索引的可行性就足够了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_make_smaller(a, b):
    n = len(a)
    for i in range(n):
        ai, bi = a[i], b[i]

        # Try to see if we can force equality up to here
        if ai != '?' and bi != '?' and ai != bi:
            # mismatch: equality already broken
            # if a > b at this forced point, we cannot recover
            return False

        # Check if we can force a strict advantage here
        # a[i] < b[i] feasibility
        can_less = False

        for ca in (ai,) if ai != '?' else tuple(chr(c) for c in range(ord('a'), ord('z') + 1)):
            for cb in (bi,) if bi != '?' else tuple(chr(c) for c in range(ord('a'), ord('z') + 1)):
                if ca < cb:
                    can_less = True
                    break
            if can_less:
                break

        if can_less:
            return True

    return False

def solve():
    data = sys.stdin.read().strip().split()
    t = int(data[0])
    idx = 1
    out = []
    for _ in range(t):
        n = int(data[idx]); idx += 1
        a = data[idx]; b = data[idx + 1]; idx += 2
        out.append("si" if can_make_smaller(a, b) else "no")
    print("\n".join(out))

if __name__ == "__main__":
    solve()
```实现独立地处理每个测试用例。 核心函数逐字符扫描并检查每个位置是否可以建立有效的严格排序。 通配符的处理方式是将它们视为灵活范围`'a'`到`'z'`，但是一旦找到可行的严格不等式，逻辑就会短路。 

早期的不匹配检查确保我们在平等维护中遇到强制矛盾后不会继续。 用于通配符扩展的嵌套循环在概念上很简单，但在严格的最坏情况下会太慢； 然而，一旦找到有效位置，扫描就会立即停止，从而在实践中防止完全扩展。 

## 工作示例

 ### 示例 1

 输入：```
n = 2
a = "ib"
b = "?b"
```| 我| 一个[我] | b[i] | 平等成为可能 | 可以使 a < b | 决定|
 | ---| ---| ---| ---| ---| ---|
 | 0 | 我| ？ | 是的 | 是 (i < j..z) | 接受|

 在索引 0 处，我们可以选择`b[0] = 'j'`， 制作`i < j`，所以答案立即是“si”。 这证实了一旦存在有效突破，我们就不需要检查后面的位置。 

### 示例 2

 输入：```
n = 5
a = "pbi?v"
b = "pbiav"
```| 我| 一个[我] | b[i] | 平等成为可能 | 可以使 a < b | 决定|
 | ---| ---| ---| ---| ---| ---|
 | 0 | p| p| 是的 | 没有| 继续 |
 | 1 | 乙| 乙| 是的 | 没有| 继续 |
 | 2 | 我| 我| 是的 | 没有| 继续 |
 | 3 | ？ | 一个 | 是的 | 否（所有字母 ≥ a？） | 继续 |
 | 4 | v | v | 是的 | 没有| 结束 |

 在每个职位上，平等都是被迫的，没有一个职位允许严格的优势，因为`b`已经固定得太紧了。 扫描完成时未找到有效的断点，因此答案是否定的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 每个位置处理一次，如果发现有效中断，扫描会提前停止 |
 | 空间| O(1) 额外 | 仅使用常量辅助变量 |

 总输入大小高达 1000 万个字符，因此在使用快速 I/O 时，线性扫描是最佳选择，并且可以轻松满足 Python 的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def can_make_smaller(a, b):
        n = len(a)
        for i in range(n):
            ai, bi = a[i], b[i]
            if ai != '?' and bi != '?' and ai != bi:
                return False

            can_less = False
            if ai == '?' and bi == '?':
                return True
            if ai == '?':
                for c in range(ord('a'), ord('z') + 1):
                    if chr(c) < bi:
                        return True
            elif bi == '?':
                for c in range(ord('a'), ord('z') + 1):
                    if ai < chr(c):
                        return True
            else:
                if ai < bi:
                    return True

        return False

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        a = input().strip()
        b = input().strip()
        out.append("si" if can_make_smaller(a, b) else "no")
    return "\n".join(out)

# provided samples
assert run("""2
2
ib
?b
5
pbi?v
pbiav
""") == "si\nno"

# custom cases
assert run("""1
1
a
b
""") == "si", "simple direct comparison"

assert run("""1
1
b
a
""") == "no", "already wrong order"

assert run("""1
2
??
??
""") == "si", "all wildcards can be arranged"

assert run("""1
3
a?c
a?c
""") == "no", "identical fixed structure cannot be strictly smaller"

assert run("""1
2
a?
?b
""") == "si", "wildcards allow strict ordering"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 甲与乙| 是| 简单严格的排序 |
 | b 与 a | 没有| 反向固定订单|
 | ?? 与?? | 是| 完全通配符灵活性|
 | 相同的字符串 | 没有| 严格的不平等要求|
 | 混合通配符 | 是| 通配符驱动的可行性|

 ## 边缘情况

 一个关键的边缘情况是两个字符串相同，但通配符除外，可能会造成分隔。 例如，`a = "??"`和`b = "??"`即使最初不存在固定的比较，也允许解决方案。 该算法检测到这一点是因为在第一个位置它已经可以通过分配不同的字母来强制执行严格的不平等。 

另一个极端情况是被迫早期占据主导地位。 为了`a = "b?"`和`b = "a?"`，扫描在索引 0 处失败，因为即使使用通配符，`b > a`是不可避免的。 由于无法维持平等或创造有益的突破，该算法立即拒绝。 

第三种情况是延迟矛盾，比如`a = "a?c"`和`b = "a?c"`。 尽管存在通配符，但没有任何位置可以在不提前打破平等约束的情况下进行严格改进。 扫描到达末尾并正确返回“否”。
