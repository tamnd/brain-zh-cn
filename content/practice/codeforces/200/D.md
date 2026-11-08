---
title: "CF 200D - 编程语言"
description: "我们得到了过程声明的集合和变量的集合。 每个过程声明都包含一个名称和一个参数类型列表。 参数类型可以是 int、string 或 double 等具体类型之一，也可以是通配符类型 T。"
date: "2026-06-03T16:27:03+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "expression-parsing", "implementation"]
categories: ["algorithms"]
codeforces_contest: 200
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 126 (Div. 2)"
rating: 1800
weight: 200
solve_time_s: 129
verified: true
draft: false
---

[CF 200D - 编程语言](https://codeforces.com/problemset/problem/200/D)

 **评分：** 1800
 **标签：** 二分查找、暴力破解、表达式解析、实现
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了过程声明的集合和变量的集合。 

每个过程声明都包含一个名称和一个参数类型列表。 参数类型可以是具体类型之一`int`,`string`， 或者`double`，或者可能是通配符类型`T`。 类型`T`匹配任何变量类型。 

随后给出了过程调用。 调用包含过程名称和变量名称列表。 由于每个变量都有一个已知的类型，因此每个调用都可以被视为过程名称以及参数类型的有序列表。 

对于每次调用，我们必须计算有多少声明的过程与其兼容。 

如果所有三个条件都满足，则过程是兼容的：

 1. 名称相同。 
2. 参数数量相同。 
3. 对于每个位置，过程参数类型是`T`，或者它完全等于相应的参数类型。 

主要的难点不是匹配逻辑。 困难的部分是正确解析输入，因为关键字、逗号和括号周围几乎到处都可能出现任意空格。 

限制相当小。 最多有 1000 个过程声明和最多 1000 个调用。 每个参数列表的长度最多为 5。调用和每个过程之间的直接比较只需要大约$$1000 \times 1000 \times 5 = 5 \cdot 10^6$$最坏情况下的类型比较。 

在 2 秒的限制内可以轻松接受 500 万次简单字符串比较。 这意味着问题主要是实现和解析问题，而不是算法优化问题。 

一些边缘情况可能会悄悄地破坏粗心的解析器。 

考虑：```
void  f ( int , T )
```和```
f(a,b)
```该声明在每个标记周围包含任意空格。 基于固定位置或简单的空格分割的解析器将会失败。 

另一个微妙的情况是匹配`T`。```
void f(T)
void f(int)

int a
f(a)
```正确答案是：```
2
```因为两种声明都是合适的。 一个常见的错误是治疗`T`作为具体类型而不是通配符。 

另一个边缘情况是不同的参数计数。```
void f(T)
void f(T,T)

int a
f(a)
```正确答案是：```
1
```虽然`T`匹配任何内容，参数的数量仍然必须完全匹配。 

最后，过程名称可以包含数字：```
void foo123(int)
```假设标识符仅包含字母的解析器会错误地拒绝有效名称。 

## 方法

 最直接的解决方案是解析所有声明，存储它们，并为每个调用测试每个过程声明。 

对于单一比较，我们检查三件事。 名称必须匹配。 参数计数必须匹配。 那么每个参数位置必须满足精确类型相等或通配符`T`。 

这种蛮力方法显然是正确的，因为它从字面上实现了适用性的定义。 对于每次调用，它都会检查每个声明并准确计算满足规则的声明。 

人们自然关心的是效率。 通过 1000 次声明和 1000 次调用，我们最多执行一百万次声明-调用比较。 由于每个声明最多包含 5 个参数，因此总工作量约为 500 万个参数检查。 这很容易足够快。 

不需要复杂的索引、散列方案或二分搜索。 该问题分为几个标签，因为解析和匹配模式有时可以优化，但给定的约束使得直接实现完全足够。 

真实的观察结果是参数数量上限为 5。 即使对每个呼叫的所有过程进行完整扫描，也仍然在限制范围内。 一旦我们意识到这一点，任务就变成了仔细解析并忠实地执行匹配规则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nkL) | O(n + m) | 已接受 |
 | 最佳 | O(nkL) | O(n + m) | 已接受 |

 这里$L \le 5$是参数的最大数量。 

## 算法演练

 1. 阅读所有过程声明。 
2. 对于每个声明，删除周围的空格并解析：

 - 程序名称
 - 参数类型的有序列表
 3. 将每个声明存储为一对：

 - 程序名称
 - 参数类型列表
 4. 阅读所有变量声明。 
5. 存储从变量名称到变量类型的映射。 
6. 对于每个过程调用，解析：

 - 被调用的过程名称
 - 变量名的有序列表
 7. 使用变量表将变量名称转换为相应的类型。 
8. 将此调用的应答初始化为零。 
9. 迭代每个存储过程声明。 
10. 如果名称不同，请立即跳过。 
11. 如果参数计数不同，则立即跳过。 
12、一一比较对应的位置。 

当声明类型为时，位置匹配`T`或者当它等于参数类型时。 
13. 如果每个位置都匹配，则增加答案。 
14. 输出调用的最终计数。 

### 为什么它有效

 对于每次调用，算法都会检查每个声明的过程一次。 当且仅当满足定义中的所有条件时，过程才会对计数起作用。 

名称检查强制使用相同的过程名称。 长度检查强制执行相同的参数计数。 位置比较强制执行声明包含的精确匹配规则`T`或者具体类型相同。 

由于每个声明都经过测试，并且除非所有规则都成立，否则不会对声明进行计数，因此所得计数恰好是合适过程的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def parse_signature(line):
    line = line.strip()

    if line.startswith("void"):
        line = line[4:].strip()

    pos_l = line.find('(')
    pos_r = line.rfind(')')

    name = line[:pos_l].strip()

    inside = line[pos_l + 1:pos_r].strip()

    if inside == "":
        params = []
    else:
        params = [x.strip() for x in inside.split(',')]

    return name, params

def solve():
    n = int(input())

    procedures = []

    for _ in range(n):
        procedures.append(parse_signature(input()))

    m = int(input())

    var_type = {}

    for _ in range(m):
        parts = input().strip().split()
        var_type[parts[1]] = parts[0]

    k = int(input())

    answers = []

    for _ in range(k):
        name, vars_used = parse_signature(input())

        arg_types = [var_type[v] for v in vars_used]

        cnt = 0

        for proc_name, proc_types in procedures:
            if proc_name != name:
                continue

            if len(proc_types) != len(arg_types):
                continue

            ok = True

            for p, a in zip(proc_types, arg_types):
                if p != "T" and p != a:
                    ok = False
                    break

            if ok:
                cnt += 1

        answers.append(str(cnt))

    sys.stdout.write("\n".join(answers))

if __name__ == "__main__":
    solve()
```解析器是实现中最微妙的部分。 

声明和调用共享相同的通用结构：```
name(type1,type2,...)
```唯一的区别是声明可以以关键字开头`void`。 辅助函数会删除存在的前缀，然后提取过程名称和括号之间以逗号分隔的内容。 

每个提取的标记都被单独去除空格。 这使得解析器不受逗号、括号和关键字周围任意空格的影响。 

匹配循环直接遵循定义。 首先检查名称和参数计数，因为它们允许提前拒绝。 然后我们才比较相应的参数位置。 

通配符规则的实现方式是：```
if p != "T" and p != a:
```仅当声明参数既不是通配符也不是正确的具体类型时才会拒绝。 

由于最大参数数仅为 5，因此不需要进行额外的优化。 

## 工作示例

 ### 示例 1

 输入：```
4
void f(int,T)
void f(T, T)
void foo123(int,double,string,string)
void p(T,double)
3
int a
string s
double x123
5
f(a,a)
f(s,a)
foo(a,s,s)
f(s,x123)
proc(a)
```程序：

 | 程序 | 类型 |
 | --- | --- |
 | f | [整数，T] |
 | f | [T，T] |
 | foo123 | [整数、双精度、字符串、字符串] |
 | p| [T，双] |

 变量：

 | 变量| 类型 |
 | --- | --- |
 | 一个 | 整数 |
 | s | 字符串|
 | x123 | 双|

 称呼`f(a,a)`：

 | 候选人| 比赛|
 | --- | --- |
 | f(int,T) | f(int,T) | 是的 |
 | f(T,T) | f(T,T) | 是的 |

 答案=2。 

致电`f(s,a)`：

 | 候选人| 比赛|
 | --- | --- |
 | f(int,T) | f(int,T) | 没有 |
 | f(T,T) | f(T,T) | 是的 |

 答案 = 1。 

致电`foo(a,s,s)`：

 | 候选人| 比赛|
 | --- | --- |
 | foo123(...) | foo123(...) | 名称不匹配|

 答案 = 0。 

此跟踪显示过程名称必须完全匹配并且`T`表现为通配符。 

### 自定义示例

 输入：```
3
void g(T)
void g(int)
void g(string)
2
int a
string b
2
g(a)
g(b)
```为了`g(a)`：

 | 候选人| 参数类型 | 比赛|
 | --- | --- | --- |
 | 克（T）| [T] | 是的 |
 | g(整数) | [整数] | 是的 |
 | g(字符串) | [字符串] | 没有 |

 答案=2。 

对于`g(b)`：

 | 候选人| 参数类型 | 比赛|
 | --- | --- | --- |
 | 克（T）| [T] | 是的 |
 | g(整数) | [整数] | 没有 |
 | g(字符串) | [字符串] | 是的 |

 答案=2。 

此示例演示了多个声明可以同时匹配同一个调用。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(nkL) | 每次调用都会检查每个过程，每个过程最多进行 L ≤ 5 个参数比较 |
 | 空间| O(n + m) | 存储过程和变量表|

 和$n \le 1000$,$k \le 1000$， 和$L \le 5$，总工作量最多约为五百万个参数比较。 这完全符合时间限制。 内存使用量很小，因为只存储声明和变量类型映射。 

## 测试用例```python
# helper: run solution on input string, return output string
import io
import sys

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    def parse_signature(line):
        line = line.strip()

        if line.startswith("void"):
            line = line[4:].strip()

        l = line.find("(")
        r = line.rfind(")")

        name = line[:l].strip()

        inside = line[l + 1:r].strip()

        if inside:
            params = [x.strip() for x in inside.split(",")]
        else:
            params = []

        return name, params

    n = int(input())
    procedures = [parse_signature(input()) for _ in range(n)]

    m = int(input())
    vars_ = {}

    for _ in range(m):
        t, v = input().split()
        vars_[v] = t

    k = int(input())
    ans = []

    for _ in range(k):
        name, vars_used = parse_signature(input())
        arg_types = [vars_[v] for v in vars_used]

        cur = 0

        for pname, ptypes in procedures:
            if pname != name:
                continue

            if len(ptypes) != len(arg_types):
                continue

            ok = True

            for p, a in zip(ptypes, arg_types):
                if p != "T" and p != a:
                    ok = False
                    break

            if ok:
                cur += 1

        ans.append(str(cur))

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return "\n".join(ans)

# sample 1
assert run(
"""4
void f(int,T)
void f(T, T)
void foo123(int,double,string,string)
void p(T,double)
3
int a
string s
double x123
5
f(a,a)
f(s,a)
foo(a,s,s)
f(s,x123)
proc(a)
"""
) == "2\n1\n0\n1\n0"

# minimum case
assert run(
"""1
void f(T)
1
int a
1
f(a)
"""
) == "1"

# parameter count mismatch
assert run(
"""2
void f(T)
void f(T,T)
1
int a
1
f(a)
"""
) == "1"

# wildcard and exact match together
assert run(
"""3
void g(T)
void g(int)
void g(string)
2
int a
string b
2
g(a)
g(b)
"""
) == "2\n2"

# many spaces
assert run(
"""1
  void   abc123 (  int , T )   
2
int x
double y
1
 abc123 ( x , y )
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一声明`T`| 1 | 最小有效实例 |
 | 不同的参数计数 | 1 | 精确数量匹配 |
 | 精确类型加通配符 | 2, 2 | 多个匹配声明 |
 | 过多的空白 | 1 | 强大的解析 |
 | 输入样本| 2,1,0,1,0 | 2,1,0,1,0 | 完整的问题行为|

 ## 边缘情况

 考虑具有不同参数计数的声明：```
2
void f(T)
void f(T,T)
1
int a
1
f(a)
```该调用有一个参数。 第一个声明通过了长度检查。 第二个声明被立即拒绝，因为它需要两个参数。 该算法输出：```
1
```这是正确的。 

考虑通配符匹配：```
2
void f(T)
void f(string)
1
int a
1
f(a)
```呼叫类型列表是`[int]`。 

为了`f(T)`，比较成功，因为`T`接受任何类型。 

为了`f(string)`，比较失败，因为`string != int`。 

答案是：```
1
```符合语言规则。 

考虑包含数字的名称：```
1
void foo123(int)
1
int a
1
foo123(a)
```解析器提取`foo123`作为名称，而不施加任何仅限字母的限制。 声明与调用相匹配，产生：```
1
```这证实了标识符解析可以处理完整的有效名称集。
