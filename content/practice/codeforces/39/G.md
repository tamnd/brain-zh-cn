---
title: "CF 39G - 反函数"
description: "我们得到了一个用严格限制的 C++ 子集编写的微小递归函数 f(n) 的源代码。 该函数仅包含顺序 if (...) return ...; 声明并无条件退货...； 声明。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 39
codeforces_index: "G"
codeforces_contest_name: "School Team Contest 1 (Winter Computer School 2010/11)"
rating: 2400
weight: 39
solve_time_s: 122
verified: true
draft: false
---
[CF 39G - 反函数](https://codeforces.com/problemset/problem/39/G)

 **评分：** 2400
 **标签：** 实施
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个小型递归函数的源代码`f(n)`用受严格限制的 C++ 子集编写。 该函数仅包含顺序`if (...) return ...;`陈述和无条件`return ...;`声明。 表达式可能包含算术、比较和递归调用`f`。 

机器算术不寻常。 加法、减法和乘法以模数执行`32768`，而除法是普通的整数除法。 每个有效输入`n`在于`[0, 32767]`，并且每个函数的结果也都在这个范围内。 

任务与通常的方向相反。 我们被赋予了一个值`y = f(n)`以及函数定义本身。 我们必须恢复最大的`n`这样`f(n) = y`。 如果没有这样的`n`存在，我们打印`-1`。 

该语句中最令人生畏的部分是递归语法，但实际输入大小完全改变了问题的本质。 整个程序文本最多100字节。 这意味着解析的语法树很小。 域大小也精确固定为`32768`可能的输入。 甚至针对每种可能的情况单独评估该函数`n`如果每个评估都是有效的，那么它就是现实的。 

递归限制是关键的结构保证。 每当我们评估`f(N)`，递归调用只能使用较小的参数。 这意味着依赖图是非循环的。 我们可以安全地计算出所有值`0`使用记忆或动态规划向上。 

粗心的实施可能会在多个地方默默地失败。 

一个常见的错误是忘记乘法也是模数`32768`。 

例如：```
return 200 * 200;
```数学结果是`40000`，但函数值为：```
40000 mod 32768 = 7232
```使用普通的整数乘法会产生完全错误的答案。 

另一个微妙的问题是除法的评估顺序。 

考虑：```
return 7 / 2 * 3;
```操作在相同的优先级内从左到右进行评估。 结果是：```
(7 / 2) * 3 = 3 * 3 = 9
```不是：```
7 / (2 * 3) = 1
```忽略关联性的解析器会错误地评估许多表达式。 

如果省略记忆化，递归调用也会产生陷阱。 

例子：```
if (n == 0) return 1;
return f(n - 1) + 1;
```没有缓存，评估所有`32768`状态递归地变成二次的。 通过记忆，每个状态都会计算一次。 

最后的微妙之处是答案要求。 我们需要最大有效`n`，不是第一次遇到。 

例子：```
if (n < 100) return 17;
return 17;
```每个输入映射到`17`，所以答案是`32767`。 在第一个匹配处停止会错误地返回`0`。 

## 方法

 直接暴力破解的想法很简单。 解析函数，然后对于每个`n`从`0`到`32767`， 评价`f(n)`并与目标值进行比较。 由于递归调用仅针对较小的参数，因此递归自然终止。 

这听起来已经可行，因为域大小仅为`32768`。 问题是重复重新计算。 假设函数是：```
return f(n - 1) + 1;
```评估中`f(30000)`每次都递归地重新计算几乎整个前缀。 总工作量大致变为：```
1 + 2 + 3 + ... + 32768
```这是关于`5 * 10^8`评估，在 Python 中太慢了。 

关键的观察是递归依赖图是严格单向的。 每个州只依赖于较小的州。 这意味着每个`f(n)`可以只计算一次并永久重用。 

将程序解析为抽象语法树后，我们按升序评估值`n`。 每当需要表达时`f(x)`，值为`x`已经计算过了，因为`x < n`。 

语法本身足够小，手写的递归下降解析器是理想的选择。 语法已经编码了优先规则：```
product before sum
left associativity inside each level
```因此，我们完全根据语法解析表达式，并根据当前的情况对它们进行评估`n`。 

蛮力之所以有效，是因为域很小，但重复的递归扩展使其成本过高。 记忆化将递归转换为线性时间动态程序`32768`州。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 无需记忆的暴力破解 | 最差递归链中的指数 | O(递归深度) | 太慢了 |
 | 最佳记忆评估 | O(32768 × 程序大小) | 欧(32768) | 已接受 |

 ## 算法演练

 1. 读取目标值并将剩余输入连接成一个字符串。 

空格和换行符与语法无关，因此处理一个紧凑的字符串可以简化解析。 
2. 为语法构建分词器和递归下降解析器。 

我们使用标准优先级层次结构解析表达式：`comparison -> sum -> product -> atom`这保证了正确的评估顺序`+`,`-`,`*`， 和`/`。 
3. 将函数体解析为语句列表。 

每个语句是：```
return expr;
```或者：```
if (cond) return expr;
```4. 将表达式表示为语法树节点。 

每个节点存储其类型：```
number
variable n
binary operator
recursive call
```这允许快速重复评估不同的值`n`。 
5. 创建数组`dp[0..32767]`。`dp[x]`将存储计算值`f(x)`。 
6. 按升序评估值`0`到`32767`。 

评价时`f(n)`，按顺序扫描语句。 

对于有条件退货：

 - 评估状况
 - 如果为 true，则立即计算并返回表达式

 无条件退货：

 - 立即评估并返回

 由于递归调用仅使用较小的参数，因此每个需要`dp[k]`已经存在。 
7. 表达式求值期间：

 - 加法、减法和乘法减少模数`32768`- 减法被标准化回`[0, 32767]`- 除法使用普通整数除法
 - 递归调用使用先前计算的`dp[value]`8. 追踪最大的`n`其计算值等于目标。 
9. 打印最大匹配`n`， 或者`-1`如果不存在匹配项。 

### 为什么它有效

 该问题保证了递归调用`f(N)`仅目标值小于`N`。 这创建了状态的拓扑顺序：```
0, 1, 2, ...
```计算时`dp[n]`，每个递归依赖关系都已完成。 表达式求值完全遵循语言语法，因此运算符优先级和结合性符合规范。 由于语句是按顺序处理的，并且评估在第一个返回语句处停止，因此模拟执行与原始程序相同。 每一个`dp[n]`因此正好等于真实函数值`f(n)`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 32768

class Parser:
    def __init__(self, s):
        self.s = s
        self.i = 0

    def skip(self):
        while self.i < len(self.s) and self.s[self.i].isspace():
            self.i += 1

    def match(self, t):
        self.skip()
        if self.s.startswith(t, self.i):
            self.i += len(t)
            return True
        return False

    def expect(self, t):
        assert self.match(t)

    def parse_number(self):
        self.skip()
        j = self.i
        while self.i < len(self.s) and self.s[self.i].isdigit():
            self.i += 1
        return ("num", int(self.s[j:self.i]))

    def parse_atom(self):
        self.skip()

        if self.match("n"):
            return ("n",)

        if self.match("f"):
            self.expect("(")
            expr = self.parse_sum()
            self.expect(")")
            return ("call", expr)

        if self.s[self.i].isdigit():
            return self.parse_number()

        if self.match("("):
            expr = self.parse_sum()
            self.expect(")")
            return expr

    def parse_product(self):
        node = self.parse_atom()

        while True:
            self.skip()

            if self.match("*"):
                node = ("bin", "*", node, self.parse_atom())
            elif self.match("/"):
                node = ("bin", "/", node, self.parse_atom())
            else:
                break

        return node

    def parse_sum(self):
        node = self.parse_product()

        while True:
            self.skip()

            if self.match("+"):
                node = ("bin", "+", node, self.parse_product())
            elif self.match("-"):
                node = ("bin", "-", node, self.parse_product())
            else:
                break

        return node

    def parse_condition(self):
        left = self.parse_sum()

        self.skip()

        if self.match("=="):
            op = "=="
        elif self.match(">"):
            op = ">"
        else:
            self.expect("<")
            op = "<"

        right = self.parse_sum()

        return (op, left, right)

    def parse_statement(self):
        self.skip()

        if self.match("if"):
            self.expect("(")
            cond = self.parse_condition()
            self.expect(")")
            self.expect("return")
            expr = self.parse_sum()
            self.expect(";")
            return ("if", cond, expr)

        self.expect("return")
        expr = self.parse_sum()
        self.expect(";")
        return ("ret", expr)

    def parse_program(self):
        self.expect("int")
        self.expect("f")
        self.expect("(")
        self.expect("int")
        self.expect("n")
        self.expect(")")
        self.expect("{")

        stmts = []

        while True:
            self.skip()
            if self.match("}"):
                break
            stmts.append(self.parse_statement())

        return stmts

def eval_expr(node, n, dp):
    t = node[0]

    if t == "num":
        return node[1]

    if t == "n":
        return n

    if t == "call":
        x = eval_expr(node[1], n, dp)
        return dp[x]

    op = node[1]

    a = eval_expr(node[2], n, dp)
    b = eval_expr(node[3], n, dp)

    if op == "+":
        return (a + b) % MOD

    if op == "-":
        return (a - b) % MOD

    if op == "*":
        return (a * b) % MOD

    return a // b

def eval_cond(cond, n, dp):
    op, left, right = cond

    a = eval_expr(left, n, dp)
    b = eval_expr(right, n, dp)

    if op == "<":
        return a < b

    if op == ">":
        return a > b

    return a == b

def solve():
    target = int(input())

    code = sys.stdin.read()

    parser = Parser(code)
    stmts = parser.parse_program()

    dp = [0] * MOD

    ans = -1

    for n in range(MOD):
        for stmt in stmts:
            if stmt[0] == "if":
                _, cond, expr = stmt

                if eval_cond(cond, n, dp):
                    dp[n] = eval_expr(expr, n, dp)
                    break
            else:
                _, expr = stmt
                dp[n] = eval_expr(expr, n, dp)
                break

        if dp[n] == target:
            ans = n

    print(ans)

solve()
```解析器直接镜像语法。`parse_product`把手`*`和`/`， 尽管`parse_sum`把手`+`和`-`。 由于每个级别从左到右重复使用运算符，因此关联性会自动变得正确。 

表达式树用元组而不是类来表示。 这使得评估变得轻量级且足够快，可以执行数万次。 

动态规划顺序是最重要的实现细节。 我们计算`dp[0]`， 然后`dp[1]`， 等等。 问题保证表明递归调用仅使用较小的参数，因此每个递归依赖项都已经可用。 

模数处理是另一个容易发生错误的地方。 蟒蛇的`%`减法结果已经保持非负：```
(a - b) % MOD
```与问题定义完全匹配。 

语句循环在第一个返回分支后立即停止，就像真正的执行一样。 忘记了`break`会错误地继续扫描后面的语句。 

## 工作示例

 ### 示例 1

 输入：```
17
int f(int n)
{
if (n < 100) return 17;
if (n > 99) return 27;
}
```跟踪所选值：
 | 和| 第一个条件`n < 100`| 返回值 | 匹配目标|
 | ---| ---| ---| ---|
 | 0 | 真实 | 17 | 17 是的 |
 | 50 | 50 真实 | 17 | 17 是的 |
 | 99 | 99 真实 | 17 | 17 是的 |
 | 100 | 100 假 | 27 | 27 没有|
 | 32767 | 32767 假 | 27 | 27 没有|

 最大的匹配输入是`99`。 

此示例演示了执行在第一个满足的 return 语句处停止。 第二个条件永远不会被检查`n < 100`。 

### 示例 2

 输入：```
1
int f(int n)
{
if(n==0)return 1;
return f(n-1)+1;
}
```跟踪前几个状态：

 | n | 递归依赖 | 计算值 |
 | ---| ---| ---|
 | 0 | 无 | 1 |
 | 1 | f(0) | f(0) | 2 |
 | 2 | f(1) | f(1) | 3 |
 | 3 | f(2) | f(2) | 4 |

 目标值`1`仅出现在`n = 0`。 

该迹线证实了递增阶 DP 起作用的原因。 在评估当前状态之前，每个递归依赖项都已经存在。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(32768 × S) |`S`是微小的解析程序大小|
 | 空间| 欧(32768) | 所有函数值的 DP 数组 |

 源代码长度最多为100字节，因此语法树非常小。 评估每个输入`0`到`32767`在5秒限制内是完全安全的。 内存使用量由 DP 数组的大小决定`32768`。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

MOD = 32768

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    input = sys.stdin.readline

    class Parser:
        def __init__(self, s):
            self.s = s
            self.i = 0

        def skip(self):
            while self.i < len(self.s) and self.s[self.i].isspace():
                self.i += 1

        def match(self, t):
            self.skip()
            if self.s.startswith(t, self.i):
                self.i += len(t)
                return True
            return False

        def expect(self, t):
            assert self.match(t)

        def parse_number(self):
            self.skip()
            j = self.i
            while self.i < len(self.s) and self.s[self.i].isdigit():
                self.i += 1
            return ("num", int(self.s[j:self.i]))

        def parse_atom(self):
            self.skip()

            if self.match("n"):
                return ("n",)

            if self.match("f"):
                self.expect("(")
                expr = self.parse_sum()
                self.expect(")")
                return ("call", expr)

            if self.s[self.i].isdigit():
                return self.parse_number()

            self.expect("(")
            expr = self.parse_sum()
            self.expect(")")
            return expr

        def parse_product(self):
            node = self.parse_atom()

            while True:
                self.skip()

                if self.match("*"):
                    node = ("bin", "*", node, self.parse_atom())
                elif self.match("/"):
                    node = ("bin", "/", node, self.parse_atom())
                else:
                    break

            return node

        def parse_sum(self):
            node = self.parse_product()

            while True:
                self.skip()

                if self.match("+"):
                    node = ("bin", "+", node, self.parse_product())
                elif self.match("-"):
                    node = ("bin", "-", node, self.parse_product())
                else:
                    break

            return node

        def parse_condition(self):
            left = self.parse_sum()

            if self.match("=="):
                op = "=="
            elif self.match(">"):
                op = ">"
            else:
                self.expect("<")
                op = "<"

            right = self.parse_sum()

            return (op, left, right)

        def parse_statement(self):
            if self.match("if"):
                self.expect("(")
                cond = self.parse_condition()
                self.expect(")")
                self.expect("return")
                expr = self.parse_sum()
                self.expect(";")
                return ("if", cond, expr)

            self.expect("return")
            expr = self.parse_sum()
            self.expect(";")
            return ("ret", expr)

        def parse_program(self):
            self.expect("int")
            self.expect("f")
            self.expect("(")
            self.expect("int")
            self.expect("n")
            self.expect(")")
            self.expect("{")

            stmts = []

            while True:
                self.skip()
                if self.match("}"):
                    break
                stmts.append(self.parse_statement())

            return stmts

    def eval_expr(node, n, dp):
        t = node[0]

        if t == "num":
            return node[1]

        if t == "n":
            return n

        if t == "call":
            return dp[eval_expr(node[1], n, dp)]

        op = node[1]
        a = eval_expr(node[2], n, dp)
        b = eval_expr(node[3], n, dp)

        if op == "+":
            return (a + b) % MOD
        if op == "-":
            return (a - b) % MOD
        if op == "*":
            return (a * b) % MOD

        return a // b

    def eval_cond(cond, n, dp):
        op, l, r = cond
        a = eval_expr(l, n, dp)
        b = eval_expr(r, n, dp)

        if op == "<":
            return a < b
        if op == ">":
            return a > b
        return a == b

    target = int(input())
    code = sys.stdin.read()

    parser = Parser(code)
    stmts = parser.parse_program()

    dp = [0] * MOD
    ans = -1

    for n in range(MOD):
        for stmt in stmts:
            if stmt[0] == "if":
                _, cond, expr = stmt
                if eval_cond(cond, n, dp):
                    dp[n] = eval_expr(expr, n, dp)
                    break
            else:
                _, expr = stmt
                dp[n] = eval_expr(expr, n, dp)
                break

        if dp[n] == target:
            ans = n

    return str(ans)

# provided sample
assert run("""17
int f(int n)
{
if (n < 100) return 17;
if (n > 99) return 27;
}
""") == "99"

# constant function
assert run("""5
int f(int n){return 5;}
""") == "32767"

# modulo multiplication
assert run("""7232
int f(int n){return 200*200;}
""") == "32767"

# recursive chain
assert run("""4
int f(int n){
if(n==0)return 1;
return f(n-1)+1;
}
""") == "3"

# impossible target
assert run("""123
int f(int n){return 0;}
""") == "-1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 常量函数返回 5 | 32767 | 32767 必须返回最大的有效输入 |
 |`200*200`| 32767 | 32767 正确的模乘 |
 | 递归增量链| 3 | 递归DP评估|
 | 目标为 123 的恒零功能 | -1 | 正确处理缺失答案 |

 ## 边缘情况

 考虑模算术情况：```
7232
int f(int n){return 200*200;}
```该算法评估：```
200 * 200 = 40000
40000 mod 32768 = 7232
```每个输入映射到`7232`，所以最大的答案是`32767`。 因为乘法减少了模数`32768`，实现与问题的算术模型完全匹配。 

现在考虑递归依赖：```
3
int f(int n){
if(n==0)return 1;
return f(n-1)+1;
}
```DP 数组按以下顺序填充：```
dp[0] = 1
dp[1] = 2
dp[2] = 3
```计算时`dp[2]`，递归调用`f(1)`只是简单地读`dp[1]`，已经最终确定。 不会出现重复递归的情况。 

最后，考虑多个匹配输入：```
17
int f(int n){return 17;}
```每一个`n`是有效的。 该算法扫描所有`32768`值并在出现另一个匹配项时不断更新答案。 最终存储的答案变为`32767`，这正是该语句所要求的。
